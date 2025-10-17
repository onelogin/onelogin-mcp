/**
 * OneLogin Multi-Factor Authentication (MFA) Tools
 * API Reference: /api/2/users/{user_id}/factors
 */

/**
 * Get available authentication factors for a user
 * GET /api/2/users/{user_id}/factors/available
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getAvailableFactors(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.get(`/api/2/users/${args.user_id}/factors/available`);
}

/**
 * Enroll a user in an authentication factor
 * POST /api/2/users/{user_id}/factors/{factor_type}/enroll
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string, display_name?: string, verified?: boolean}
 * @returns {Promise<Object>}
 */
export async function enrollFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  const userId = args.user_id;
  const factorType = args.factor_type;
  const enrollData = { ...args };
  delete enrollData.user_id;
  delete enrollData.factor_type;

  return await api.post(`/api/2/users/${userId}/factors/${factorType}/enroll`, enrollData);
}

/**
 * Verify enrollment of an authentication factor using OTP
 * PUT /api/2/users/{user_id}/factors/{factor_type}/enroll/verify_otp
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string, otp_token: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorEnrollmentOTP(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  if (!args.otp_token) {
    throw new Error('otp_token is required');
  }

  const userId = args.user_id;
  const factorType = args.factor_type;

  return await api.put(`/api/2/users/${userId}/factors/${factorType}/enroll/verify_otp`, {
    otp_token: args.otp_token
  });
}

/**
 * Verify enrollment of OneLogin Voice & Protect (polling)
 * GET /api/2/users/{user_id}/factors/{factor_type}/enroll/verify_poll
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorEnrollmentPoll(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.get(`/api/2/users/${args.user_id}/factors/${args.factor_type}/enroll/verify_poll`);
}

/**
 * Activate an enrolled authentication factor
 * POST /api/2/users/{user_id}/factors/{factor_type}/activate
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function activateFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.post(`/api/2/users/${args.user_id}/factors/${args.factor_type}/activate`, {});
}

/**
 * Get enrolled authentication factors status for a user
 * GET /api/2/users/{user_id}/factors/{factor_type}/status
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function getFactorStatus(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.get(`/api/2/users/${args.user_id}/factors/${args.factor_type}/status`);
}

/**
 * Verify an authentication factor (PUT)
 * PUT /api/2/users/{user_id}/factors/{factor_type}/verify
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string, otp_token?: string, device_id?: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  const userId = args.user_id;
  const factorType = args.factor_type;
  const verifyData = { ...args };
  delete verifyData.user_id;
  delete verifyData.factor_type;

  return await api.put(`/api/2/users/${userId}/factors/${factorType}/verify`, verifyData);
}

/**
 * Verify an authentication factor (polling)
 * GET /api/2/users/{user_id}/factors/{factor_type}/verify_poll
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorPoll(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.get(`/api/2/users/${args.user_id}/factors/${args.factor_type}/verify_poll`);
}

/**
 * Verify an authentication factor (POST - triggers push notification)
 * POST /api/2/users/{user_id}/factors/{factor_type}/verify
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function triggerFactorVerification(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.post(`/api/2/users/${args.user_id}/factors/${args.factor_type}/verify`, {});
}

/**
 * Remove an authentication factor from a user
 * DELETE /api/2/users/{user_id}/factors/{factor_type}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_type: string}
 * @returns {Promise<Object>}
 */
export async function removeFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_type) {
    throw new Error('factor_type is required');
  }

  return await api.delete(`/api/2/users/${args.user_id}/factors/${args.factor_type}`);
}

/**
 * Generate an MFA token for a user
 * POST /api/2/users/{user_id}/mfa_token
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, reusable?: boolean, expires_in?: number}
 * @returns {Promise<Object>}
 */
export async function generateMFAToken(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  const userId = args.user_id;
  const tokenData = { ...args };
  delete tokenData.user_id;

  return await api.post(`/api/2/users/${userId}/mfa_token`, tokenData);
}
