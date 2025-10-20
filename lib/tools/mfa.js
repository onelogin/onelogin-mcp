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

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'get_available_factors',
    description: 'Get available MFA factors for a user. Supports OneLogin SMS, Voice, Email, Protect, and Google Authenticator. Use this before enrolling a factor to see what factors are available. Returns factor list with IDs and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        }
      },
      required: ['user_id'],
      additionalProperties: false
    }
  },
  {
    name: 'enroll_factor',
    description: 'Initiate MFA enrollment for a user. Status will be "pending" if confirmation required (Google Authenticator, OneLogin Protect) or "accepted" if verified=true (SMS, Voice, Email with pre-verified values). For OTP factors, returns verification_token and totp_url for QR code display. For Voice, user must type OTP into phone for verification. Supports custom_message for SMS (max 160 chars) and redirect_to for Email MagicLink. Returns enrollment data with registration ID, status, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor (e.g., "Google Authenticator", "OneLogin SMS", "OneLogin Voice")'
        },
        display_name: {
          type: 'string',
          description: 'Display name for the factor'
        },
        verified: {
          type: 'boolean',
          description: 'Whether the factor is pre-verified'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: true
    }
  },
  {
    name: 'verify_factor_enrollment_otp',
    description: 'Verify enrollment of Google Authenticator, SMS, Email, or Voice factors using OTP. Use after enroll_factor returns pending status. Provide the OTP code user received/generated. On success, factor becomes active. Returns verification status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        },
        otp_token: {
          type: 'string',
          description: 'One-time password token'
        }
      },
      required: ['user_id', 'factor_type', 'otp_token'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor_enrollment_poll',
    description: 'Verify enrollment of OneLogin Voice and OneLogin Protect using polling. Use after enroll_factor for these factor types. Poll periodically until user completes verification (types OTP into phone for Voice, or approves on device for Protect). Returns verification status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'activate_factor',
    description: 'Trigger an MFA challenge by sending SMS, Voice, Email, or Push notification containing OTP or Magic Link. Generates a verification_id that must be used with verify_factor to validate the OTP. Use expires_in (120-900 seconds, default 120) to control OTP expiration. Supports custom_message for SMS and redirect_to for Email MagicLink. Returns verification data with verification_id, device_id, expires_at, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'get_factor_status',
    description: 'Get status of an enrolled authentication factor for a user. Returns factor status (active/pending/disabled), enrollment details, and device information. Use to check factor readiness before triggering verification. Returns factor status data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor',
    description: 'Authenticate OTP code for SMS, Email, or Authenticator factors. Requires verification_id from activate_factor call. For SMS/Email: only OTP needed. For Authenticator: OTP + device_id needed. Returns success/error status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        },
        otp_token: {
          type: 'string',
          description: 'One-time password token'
        },
        device_id: {
          type: 'string',
          description: 'Device ID for push notifications'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: true
    }
  },
  {
    name: 'verify_factor_poll',
    description: 'Poll for verification status of push-based factors (OneLogin Protect). Use after triggering verification. Poll periodically until status changes to approved/denied. Returns verification status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'trigger_factor_verification',
    description: 'Trigger authentication factor verification by sending push notification to OneLogin Protect device. User approves/denies on their device. Use verify_factor_poll to check for user response. Returns trigger status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_factor',
    description: 'Remove an enrolled MFA factor from a user. Requires device_id from enrollment or get enrolled factors call. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_type: {
          type: 'string',
          description: 'Type of authentication factor'
        }
      },
      required: ['user_id', 'factor_type'],
      additionalProperties: false
    }
  },
  {
    name: 'generate_mfa_token',
    description: 'Generate a temporary MFA token for account recovery when MFA device has been lost. Token expires_in defaults to 259200 seconds (72 hours max). reusable flag defaults to false (single use). Returns mfa_token, expires_at, reusable flag, device_id, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        reusable: {
          type: 'boolean',
          description: 'Whether the token is reusable'
        },
        expires_in: {
          type: 'number',
          description: 'Token expiration time in seconds'
        }
      },
      required: ['user_id'],
      additionalProperties: true
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  get_available_factors: getAvailableFactors,
  enroll_factor: enrollFactor,
  verify_factor_enrollment_otp: verifyFactorEnrollmentOTP,
  verify_factor_enrollment_poll: verifyFactorEnrollmentPoll,
  activate_factor: activateFactor,
  get_factor_status: getFactorStatus,
  verify_factor: verifyFactor,
  verify_factor_poll: verifyFactorPoll,
  trigger_factor_verification: triggerFactorVerification,
  remove_factor: removeFactor,
  generate_mfa_token: generateMFAToken
};
