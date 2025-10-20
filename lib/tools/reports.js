/**
 * OneLogin Reports Tools
 * API Reference: /api/2/reports
 *
 * Reports provide analytics and insights about authentication, user activity,
 * app usage, and security events. Generate custom reports for compliance,
 * auditing, and monitoring purposes.
 */

/**
 * List available report types
 * GET /api/2/reports
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listReports(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/reports', params);
}

/**
 * Get a specific report by ID
 * GET /api/2/reports/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {report_id: number}
 * @returns {Promise<Object>}
 */
export async function getReport(api, args) {
  if (!args.report_id) {
    throw new Error('report_id is required');
  }

  return await api.get(`/api/2/reports/${args.report_id}`);
}

/**
 * Generate a report
 * POST /api/2/reports/generate
 * @param {OneLoginApi} api
 * @param {Object} args - Report parameters
 * @returns {Promise<Object>}
 */
export async function generateReport(api, args) {
  if (!args.report_type) {
    throw new Error('report_type is required');
  }

  return await api.post('/api/2/reports/generate', args);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_reports',
    description: 'Get a list of all available report types in OneLogin. Reports include authentication logs, user activity, app usage, security events, failed logins, MFA usage, and more. Returns report types with IDs, names, descriptions, available filters (date range, user, app, etc.), output formats (CSV, JSON, PDF), and scheduling options. Use to discover available analytics before generating reports. Returns report types array and x-request-id.',
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
    name: 'get_report',
    description: 'Get details about a specific report type or previously generated report by ID. For report types: returns name, description, available_filters (date_range, user_id, app_id, event_type, etc.), output_formats (csv, json, pdf), columns (data fields included in report), and scheduling_options. For generated reports: returns status (pending, completed, failed), download_url (when completed), generated_at timestamp, expires_at, row_count, and file_size. Returns report data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'number', description: 'The report ID or report type ID' }
      },
      required: ['report_id'],
      additionalProperties: false
    }
  },
  {
    name: 'generate_report',
    description: 'Generate a report with specified parameters and filters. Required: report_type (authentication_logs, user_activity, app_usage, failed_logins, mfa_usage, security_events, etc.). Configure filters: date_range (start_date, end_date in ISO 8601), user_ids (array), app_ids (array), event_types (array). Specify output_format (csv, json, pdf, default csv). Reports generate asynchronously - returns job_id immediately. Poll get_report(job_id) to check status and get download_url when completed. Returns job_id, status, estimated_completion, and x-request-id. IMPORTANT: Large reports (>100K rows) may take several minutes.',
    inputSchema: {
      type: 'object',
      properties: {
        report_type: { type: 'string', description: 'Report type (authentication_logs, user_activity, app_usage, failed_logins, mfa_usage, security_events)' },
        start_date: { type: 'string', description: 'Start date for report (ISO 8601)' },
        end_date: { type: 'string', description: 'End date for report (ISO 8601)' },
        user_ids: { type: 'array', items: { type: 'number' }, description: 'Filter by specific user IDs' },
        app_ids: { type: 'array', items: { type: 'number' }, description: 'Filter by specific app IDs' },
        event_types: { type: 'array', items: { type: 'string' }, description: 'Filter by event types' },
        output_format: { type: 'string', description: 'Output format (csv, json, pdf)' }
      },
      required: ['report_type'],
      additionalProperties: true
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_reports: listReports,
  get_report: getReport,
  generate_report: generateReport
};
