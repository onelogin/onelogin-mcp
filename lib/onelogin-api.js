/**
 * Extract OneLogin API v2 pagination metadata from response headers.
 *
 * OL v2 list endpoints return the total record count and page/cursor state in
 * response headers rather than the body (Total-Count, Current-Page, Page-Items,
 * Before-Cursor, After-Cursor). Surfacing these lets clients answer "how many X"
 * questions from a single call instead of paging through every record to tally.
 *
 * Returns null when no pagination headers are present (single-resource GETs,
 * mutations, etc.) so the standardized response stays clean for those calls.
 *
 * @param {Headers} headers - fetch Response headers (case-insensitive lookup)
 * @returns {Object|null}
 */
function extractPagination(headers) {
  const pagination = {};

  const totalCount = headers.get('total-count');
  const currentPage = headers.get('current-page');
  const pageItems = headers.get('page-items');
  const beforeCursor = headers.get('before-cursor');
  const afterCursor = headers.get('after-cursor');

  if (totalCount != null && totalCount !== '') pagination.total_count = Number(totalCount);
  if (currentPage != null && currentPage !== '') pagination.current_page = Number(currentPage);
  if (pageItems != null && pageItems !== '') pagination.page_items = Number(pageItems);
  if (beforeCursor) pagination.before_cursor = beforeCursor;
  if (afterCursor) pagination.after_cursor = afterCursor;

  return Object.keys(pagination).length > 0 ? pagination : null;
}

/**
 * OneLogin API Client
 * Handles OAuth2 authentication and API requests
 */
export class OneLoginApi {
  constructor(serverConfig) {
    this.baseUrl = serverConfig.url;
    this.clientId = serverConfig.client_id;
    this.clientSecret = serverConfig.client_secret;
    this.legacyKey = serverConfig.legacy_key;
    this.usePreprod = serverConfig.use_preprod;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with OneLogin OAuth2
   * @returns {Promise<void>}
   */
  async authenticate() {
    const authUrl = `${this.baseUrl}/auth/oauth2/v2/token`;

    // OAuth2 uses special header format from ol_cli
    const authHeader = `client_id:${this.clientId}, client_secret:${this.clientSecret}`;

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Authentication failed: ${response.status} ${error}`);
    }

    const data = await response.json();

    // Handle both direct and wrapped token formats
    const tokenData = data.access_token ? data : data.data?.[0];

    if (!tokenData || !tokenData.access_token) {
      throw new Error('Invalid token response from OneLogin');
    }

    this.token = tokenData.access_token;
    // Token expires in seconds, convert to timestamp
    this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
  }

  /**
   * Check if token is still valid
   * @returns {boolean}
   */
  isTokenValid() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }

    // Add 30 second buffer
    return Date.now() < (this.tokenExpiry - 30000);
  }

  /**
   * Make an authenticated API request
   * @param {string} endpoint - API endpoint (e.g., '/api/2/users')
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response with {success, request_id, status, data}, plus a
   *   `pagination` object ({total_count, current_page, page_items, before_cursor, after_cursor})
   *   when the endpoint returns OL v2 pagination headers.
   */
  async makeRequest(endpoint, options = {}) {
    // Ensure we have a valid token
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add preprod cookie if enabled
    if (this.usePreprod) {
      headers['Cookie'] = 'ol_use_preprod=true';
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const requestId = response.headers.get('x-request-id');

    // OL v2 returns the total record count and page state in headers; surface
    // them so counting questions can be answered without a full pagination sweep.
    const pagination = extractPagination(response.headers);

    // Parse response body
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return standardized format
    const result = {
      success: response.ok,
      request_id: requestId,
      status: response.status,
      data: data
    };
    if (pagination) result.pagination = pagination;
    return result;
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.makeRequest(fullEndpoint, {
      method: 'GET'
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @returns {Promise<Object>}
   */
  async post(endpoint, body) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @returns {Promise<Object>}
   */
  async put(endpoint, body) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Optional request body
   * @returns {Promise<Object>}
   */
  async delete(endpoint, body) {
    const options = {
      method: 'DELETE'
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    return this.makeRequest(endpoint, options);
  }
}
