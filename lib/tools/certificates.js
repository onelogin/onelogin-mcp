/**
 * OneLogin Certificates Tools
 * API Reference: /api/2/certificates
 *
 * Certificates manage X.509 certificates used for SAML signing and encryption.
 * OneLogin automatically generates and renews certificates, but these tools allow
 * manual management, renewal, and downloading for external IdP configuration.
 */

/**
 * List certificates
 * GET /api/2/certificates
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listCertificates(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/certificates', params);
}

/**
 * Get a specific certificate by ID
 * GET /api/2/certificates/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {cert_id: number}
 * @returns {Promise<Object>}
 */
export async function getCertificate(api, args) {
  if (!args.cert_id) {
    throw new Error('cert_id is required');
  }

  return await api.get(`/api/2/certificates/${args.cert_id}`);
}

/**
 * Generate a new certificate
 * POST /api/2/certificates
 * @param {OneLoginApi} api
 * @param {Object} args - Certificate configuration
 * @returns {Promise<Object>}
 */
export async function generateCertificate(api, args) {
  return await api.post('/api/2/certificates', args);
}

/**
 * Renew a certificate
 * PUT /api/2/certificates/{id}/renew
 * @param {OneLoginApi} api
 * @param {Object} args - {cert_id: number}
 * @returns {Promise<Object>}
 */
export async function renewCertificate(api, args) {
  if (!args.cert_id) {
    throw new Error('cert_id is required');
  }

  return await api.put(`/api/2/certificates/${args.cert_id}/renew`, {});
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_certificates',
    description: 'Get a list of all X.509 certificates used for SAML signing and encryption in your OneLogin account. OneLogin auto-generates certificates but you can manage them manually. Returns certificate list with IDs, names, validity periods (not_before, not_after dates), status (active, expiring_soon, expired), fingerprints (SHA-256), and x-request-id. Use to audit certificate expiration and plan renewals.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_certificate',
    description: 'Get detailed information about a specific certificate by ID. Returns complete certificate data including ID, name, certificate (PEM-encoded X.509), private_key (redacted for security), validity period (not_before, not_after), issuer, subject, serial_number, fingerprint (SHA-256), and usage (SAML signing, SAML encryption). Returns x-request-id. Use to download certificate for external IdP configuration.',
    inputSchema: {
      type: 'object',
      properties: {
        cert_id: { type: 'number', description: 'The certificate ID' }
      },
      required: ['cert_id'],
      additionalProperties: false
    }
  },
  {
    name: 'generate_certificate',
    description: 'Generate a new X.509 certificate for SAML operations. OneLogin creates 2048-bit RSA key pair and self-signed certificate valid for 3 years. Certificate is automatically used for new SAML apps. Optional: provide name (descriptive label), validity_years (1-10, default 3). Returns generated certificate with ID, PEM-encoded certificate, and x-request-id. IMPORTANT: Download and back up certificate immediately if needed for external configuration.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Certificate name (optional)' },
        validity_years: { type: 'number', description: 'Validity period in years (1-10, default 3)' }
      },
      additionalProperties: true
    }
  },
  {
    name: 'renew_certificate',
    description: 'Renew an expiring or expired certificate. Generates new certificate with same name but new key pair and extended validity (3 years from renewal date). IMPORTANT: Update external IdPs with new certificate to avoid SSO failures. Old certificate remains valid until expiry to allow graceful transition. Returns renewed certificate with new ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        cert_id: { type: 'number', description: 'The certificate ID to renew' }
      },
      required: ['cert_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_certificates: listCertificates,
  get_certificate: getCertificate,
  generate_certificate: generateCertificate,
  renew_certificate: renewCertificate
};
