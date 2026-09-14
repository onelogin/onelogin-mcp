/**
 * Pagination helpers shared by the list tools.
 *
 * How OneLogin /api/2 list endpoints actually paginate (verified live):
 *
 * - `limit` and `page` query params select a page. The response carries
 *   Total-Count / Current-Page / Page-Items / After-Cursor / Before-Cursor
 *   headers, surfaced as the `pagination` block of every tool response.
 * - To follow a cursor, send it back as the single `cursor` query param.
 *   There are NO `after_cursor` / `before_cursor` request params on v2:
 *   users, apps, roles and connectors reject them with 400, the rest silently
 *   ignore them. This module keeps them as aliases for `cursor`.
 * - A cursor already encodes limit/page (and, for roles, sort). Roles rejects
 *   a cursor combined with limit/page/sort ("Requests can only have cursor xor
 *   pagination arguments"), so a cursor is always sent alone.
 * - The cursor header values are URL-encoded (e.g. a trailing `%3D%3D`).
 *   Forwarding them verbatim through URLSearchParams double-encodes them and
 *   some endpoints (Smart Hooks) then fail to decode the cursor with a 422, so
 *   cursors are URL-decoded before being sent.
 *
 * The v1 events endpoint is different: it takes `limit` plus real
 * `after_cursor` / `before_cursor` params (from the response body's pagination
 * object) and rejects `page`. It does not use this helper's cursor logic.
 */

/**
 * URL-decode a cursor value. A cursor that is not URL-encoded is returned
 * unchanged, so decoding is safe to apply unconditionally.
 * @param {string|undefined|null} value
 * @returns {string|undefined}
 */
export function decodeCursor(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const str = String(value);
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Pick the cursor to send: the explicit `cursor` arg, else the legacy
 * `after_cursor` / `before_cursor` aliases.
 * @param {Object} args
 * @returns {string|undefined}
 */
export function resolveCursor(args = {}) {
  return decodeCursor(args.cursor ?? args.after_cursor ?? args.before_cursor);
}

/**
 * Apply v2 pagination args to a query params object.
 * When a cursor is present it is sent alone; otherwise limit/page are forwarded.
 * @param {Object} params - query params being built (mutated)
 * @param {Object} args - tool args
 * @returns {string|undefined} the cursor that was applied, if any
 */
export function applyV2Pagination(params, args = {}) {
  const cursor = resolveCursor(args);
  if (cursor) {
    params.cursor = cursor;
    return cursor;
  }
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  return undefined;
}

// Shared inputSchema snippets so every list tool documents pagination the same way.

export const CURSOR_PARAM = {
  type: 'string',
  description: "Fetch another page: pass the after_cursor (next page) or before_cursor (previous page) value from a previous response's pagination block. One cursor parameter serves both directions. Send it on its own - it already encodes limit/page, and the API rejects a cursor combined with limit/page/sort."
};

export const AFTER_CURSOR_ALIAS = {
  type: 'string',
  description: "Alias for cursor, kept for backwards compatibility: the after_cursor value from a previous response's pagination block. Prefer cursor."
};

export const BEFORE_CURSOR_ALIAS = {
  type: 'string',
  description: "Alias for cursor, kept for backwards compatibility: the before_cursor value from a previous response's pagination block. Prefer cursor."
};

/**
 * Schema for a pagination param the endpoint ignores. Kept so callers that
 * still pass it do not fail schema validation.
 * @param {'number'|'string'} type
 * @param {string} what - e.g. 'brands'
 */
export function ignoredPaginationParam(type, what) {
  return {
    type,
    description: `DEPRECATED: ignored; the API returns all ${what} in one response and does not paginate`
  };
}
