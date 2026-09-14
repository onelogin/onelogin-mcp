/**
 * OneLogin Reports Tools
 * API Reference: /api/2/reports
 *
 * The Reports API exposes the account's saved reports (built-in and custom)
 * and runs them. There is no endpoint for creating ad-hoc reports, no
 * GET-by-id endpoint, and no async job/status polling: a report is either
 * run synchronously (20s server-side limit) or emailed as a CSV.
 */

/**
 * List available reports
 * GET /api/2/reports
 * @param {OneLoginApi} api
 * @returns {Promise<Object>}
 */
export async function listReports(api) {
  return await api.get('/api/2/reports');
}

/**
 * Get a specific report by ID
 * The API has no GET /api/2/reports/{id}; fetch the list and filter client-side.
 * @param {OneLoginApi} api
 * @param {Object} args - {report_id: number}
 * @returns {Promise<Object>}
 */
export async function getReport(api, args) {
  if (!args.report_id) {
    throw new Error('report_id is required');
  }

  const result = await api.get('/api/2/reports');
  if (!result.success) {
    return result;
  }

  const report = (result.data?.reports || []).find(r => String(r.id) === String(args.report_id));
  if (!report) {
    return { ...result, success: false, status: 404, data: { message: `Report ${args.report_id} not found` } };
  }

  return { ...result, data: report };
}

/**
 * Run a report synchronously
 * POST /api/2/reports/{id}/run
 * @param {OneLoginApi} api
 * @param {Object} args - {report_id: number}
 * @returns {Promise<Object>}
 */
export async function runReport(api, args) {
  if (!args.report_id) {
    throw new Error('report_id is required');
  }

  return await api.post(`/api/2/reports/${args.report_id}/run`, {});
}

/**
 * Run a report in the background and email the CSV
 * POST /api/2/reports/{id}/run_background
 * @param {OneLoginApi} api
 * @param {Object} args - {report_id: number, email: string}
 * @returns {Promise<Object>}
 */
export async function runReportBackground(api, args) {
  if (!args.report_id) {
    throw new Error('report_id is required');
  }
  if (!args.email) {
    throw new Error('email is required');
  }

  return await api.post(`/api/2/reports/${args.report_id}/run_background`, { email: args.email });
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_reports',
    description: 'List the saved reports available in the OneLogin account (built-in reports plus any custom reports created in the admin console). Each entry has id, name, and report_type (e.g. events, app_details, user_details). Returns the full list in one response (no pagination). Use this to find the report_id for run_report / run_report_background. IMPORTANT: the Reports API cannot define new reports or apply ad-hoc filters; reports are configured in the admin console under Reports. Requires the API credential to have been created by a super user. Returns reports array and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'get_report',
    description: 'Get a single saved report by ID (id, name, report_type). The API has no per-report endpoint, so this fetches the report list and filters it client-side; it returns status 404 if the ID is not in the list. Requires the API credential to have been created by a super user. Returns report data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'number', description: 'The report ID (from list_reports)' }
      },
      required: ['report_id'],
      additionalProperties: false
    }
  },
  {
    name: 'run_report',
    description: 'Run a saved report synchronously and return its rows as JSON. Get report_id from list_reports. Returns { report: [ {column: value, ...}, ... ] } with column names derived from the report\'s configured columns. IMPORTANT: the server enforces a 20-second limit; large reports return status 422 with a timeout message, in which case use run_report_background instead. No filters or pagination can be passed; the report runs exactly as configured in the admin console. Requires the API credential to have been created by a super user (otherwise 401). Returns report rows and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'number', description: 'The report ID (from list_reports)' }
      },
      required: ['report_id'],
      additionalProperties: false
    }
  },
  {
    name: 'run_report_background',
    description: 'Run a saved report asynchronously and email the result as a CSV attachment. Use this for large reports that time out in run_report. Required: report_id (from list_reports) and email (the recipient; must be a valid address or the API returns 422). Returns immediately with a confirmation message; there is no job ID or status endpoint to poll, the CSV simply arrives by email. Requires the API credential to have been created by a super user (otherwise 401). Returns message and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        report_id: { type: 'number', description: 'The report ID (from list_reports)' },
        email: { type: 'string', description: 'Email address to send the CSV to' }
      },
      required: ['report_id', 'email'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_reports: listReports,
  get_report: getReport,
  run_report: runReport,
  run_report_background: runReportBackground
};
