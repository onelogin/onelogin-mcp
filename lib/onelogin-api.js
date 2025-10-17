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
   * @returns {Promise<Object>} Response with {success, request_id, data}
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

    // Parse response body
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return standardized format
    return {
      success: response.ok,
      request_id: requestId,
      status: response.status,
      data: data
    };
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
   * @returns {Promise<Object>}
   */
  async delete(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE'
    });
  }
}
