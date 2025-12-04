/**
 * OneLogin Multi-Factor Authentication (MFA) Tools
 * API Reference: https://developers.onelogin.com/api-docs/2/multi-factor-authentication/overview
 *
 * Endpoints use /api/2/mfa/users/{user_id}/ prefix with:
 * - /factors - available factors for enrollment
 * - /registrations - enrollment operations
 * - /devices - enrolled factors
 * - /verifications - authentication operations
 * - /mfa_token - temporary bypass tokens
 */

/**
 * Get available authentication factors for a user
 * GET /api/2/mfa/users/{user_id}/factors
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getAvailableFactors(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.get(`/api/2/mfa/users/${args.user_id}/factors`);
}

/**
 * Get enrolled authentication factors (devices) for a user
 * GET /api/2/mfa/users/{user_id}/devices
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getEnrolledFactors(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.get(`/api/2/mfa/users/${args.user_id}/devices`);
}

/**
 * Enroll a user in an authentication factor
 * POST /api/2/mfa/users/{user_id}/registrations
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, factor_id: number, display_name?: string, verified?: boolean, custom_message?: string, redirect_to?: string, expires_in?: number}
 * @returns {Promise<Object>}
 */
export async function enrollFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.factor_id) {
    throw new Error('factor_id is required (get from get_available_factors)');
  }

  const userId = args.user_id;
  const enrollData = { ...args };
  delete enrollData.user_id;

  return await api.post(`/api/2/mfa/users/${userId}/registrations`, enrollData);
}

/**
 * Verify enrollment of an authentication factor using OTP
 * PUT /api/2/mfa/users/{user_id}/registrations/{registration_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, registration_id: string, otp: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorEnrollmentOTP(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.registration_id) {
    throw new Error('registration_id is required (from enroll_factor response)');
  }

  if (!args.otp) {
    throw new Error('otp is required');
  }

  return await api.put(`/api/2/mfa/users/${args.user_id}/registrations/${args.registration_id}`, {
    otp: args.otp
  });
}

/**
 * Poll enrollment verification status for OneLogin Voice & Protect
 * GET /api/2/mfa/users/{user_id}/registrations/{registration_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, registration_id: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorEnrollmentPoll(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.registration_id) {
    throw new Error('registration_id is required (from enroll_factor response)');
  }

  return await api.get(`/api/2/mfa/users/${args.user_id}/registrations/${args.registration_id}`);
}

/**
 * Activate/trigger an authentication factor (send OTP via SMS/Voice/Email/Push)
 * POST /api/2/mfa/users/{user_id}/verifications
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, device_id: string, custom_message?: string, redirect_to?: string, expires_in?: number}
 * @returns {Promise<Object>}
 */
export async function activateFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.device_id) {
    throw new Error('device_id is required (from get_enrolled_factors response)');
  }

  const userId = args.user_id;
  const activateData = { ...args };
  delete activateData.user_id;

  return await api.post(`/api/2/mfa/users/${userId}/verifications`, activateData);
}

/**
 * Verify an authentication factor with OTP
 * PUT /api/2/mfa/users/{user_id}/verifications/{verification_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, verification_id: string, otp: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.verification_id) {
    throw new Error('verification_id is required (from activate_factor response)');
  }

  if (!args.otp) {
    throw new Error('otp is required');
  }

  return await api.put(`/api/2/mfa/users/${args.user_id}/verifications/${args.verification_id}`, {
    otp: args.otp
  });
}

/**
 * Poll for verification status (for Push/Voice/Magic Link factors)
 * GET /api/2/mfa/users/{user_id}/verifications/{verification_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, verification_id: string}
 * @returns {Promise<Object>}
 */
export async function verifyFactorPoll(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.verification_id) {
    throw new Error('verification_id is required (from activate_factor response)');
  }

  return await api.get(`/api/2/mfa/users/${args.user_id}/verifications/${args.verification_id}`);
}

/**
 * Remove an enrolled authentication factor (device) from a user
 * DELETE /api/2/mfa/users/{user_id}/devices/{device_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, device_id: string}
 * @returns {Promise<Object>}
 */
export async function removeFactor(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.device_id) {
    throw new Error('device_id is required (from get_enrolled_factors response)');
  }

  return await api.delete(`/api/2/mfa/users/${args.user_id}/devices/${args.device_id}`);
}

/**
 * Generate an MFA token for a user (temporary bypass)
 * POST /api/2/mfa/users/{user_id}/mfa_token
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

  return await api.post(`/api/2/mfa/users/${userId}/mfa_token`, tokenData);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'get_available_factors',
    description: 'Get available MFA factors for user enrollment. Returns factors configured in user\'s policy that are not yet enrolled. Each factor includes factor_id needed for enrollment. Supports OneLogin SMS, Voice, Email, Protect, and authenticator apps. Returns factor list with IDs and x-request-id.',
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
    name: 'get_enrolled_factors',
    description: 'Get enrolled MFA factors (devices) for a user. Returns all factors the user has registered. Each device includes device_id needed for activation and removal. Use before activate_factor or remove_factor to get device IDs. Returns device list with IDs, types, and status.',
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
    description: 'Initiate MFA enrollment for a user. Requires factor_id from get_available_factors. Status will be "pending" if OTP confirmation required (Google Authenticator, OneLogin Protect) or "accepted" if verified=true (SMS, Voice, Email with pre-verified values). For OTP factors, response includes registration_id for verification. Supports custom_message for SMS (max 160 chars), redirect_to for Email MagicLink, and expires_in (120-900 seconds). Returns registration data with registration_id and status.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        factor_id: {
          type: 'number',
          description: 'Factor ID from get_available_factors response'
        },
        display_name: {
          type: 'string',
          description: 'Display name for the factor (e.g., phone number for SMS)'
        },
        verified: {
          type: 'boolean',
          description: 'Set true to skip verification if value is pre-verified (e.g., known phone number)'
        },
        custom_message: {
          type: 'string',
          description: 'Custom SMS message (max 160 chars, SMS only)'
        },
        redirect_to: {
          type: 'string',
          description: 'Redirect URL for Email MagicLink'
        },
        expires_in: {
          type: 'number',
          description: 'OTP expiration in seconds (120-900, default 120)'
        }
      },
      required: ['user_id', 'factor_id'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor_enrollment_otp',
    description: 'Verify enrollment using OTP code. Use after enroll_factor returns "pending" status. Provide the registration_id from enrollment response and the OTP the user received/generated. On success, factor becomes active. Works for Google Authenticator, SMS, Email, and Voice factors.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        registration_id: {
          type: 'string',
          description: 'Registration ID (UUID) from enroll_factor response'
        },
        otp: {
          type: 'string',
          description: 'One-time password from authenticator app, SMS, email, or voice call'
        }
      },
      required: ['user_id', 'registration_id', 'otp'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor_enrollment_poll',
    description: 'Poll enrollment status for OneLogin Voice and Protect factors. Use after enroll_factor for these factor types. Poll periodically until status changes from "pending" to "accepted". For Voice: user types OTP into phone. For Protect: user approves on device. Returns registration status.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        registration_id: {
          type: 'string',
          description: 'Registration ID (UUID) from enroll_factor response'
        }
      },
      required: ['user_id', 'registration_id'],
      additionalProperties: false
    }
  },
  {
    name: 'activate_factor',
    description: 'Trigger MFA challenge by sending SMS, Voice call, Email, or Push notification. Requires device_id from get_enrolled_factors. Returns verification_id needed for verify_factor. Supports custom_message for SMS, redirect_to for Email MagicLink, and expires_in (120-900 seconds, default 120). Returns verification_id, expires_at, and device info.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        device_id: {
          type: 'string',
          description: 'Device ID from get_enrolled_factors response'
        },
        custom_message: {
          type: 'string',
          description: 'Custom SMS message (max 160 chars, SMS only)'
        },
        redirect_to: {
          type: 'string',
          description: 'Redirect URL for Email MagicLink'
        },
        expires_in: {
          type: 'number',
          description: 'OTP expiration in seconds (120-900, default 120)'
        }
      },
      required: ['user_id', 'device_id'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor',
    description: 'Authenticate OTP code for SMS, Email, or Authenticator factors. Requires verification_id from activate_factor. Provide the OTP the user entered. Returns success/error status. For Push/Voice/MagicLink factors, use verify_factor_poll instead.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        verification_id: {
          type: 'string',
          description: 'Verification ID from activate_factor response'
        },
        otp: {
          type: 'string',
          description: 'One-time password entered by user'
        }
      },
      required: ['user_id', 'verification_id', 'otp'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_factor_poll',
    description: 'Poll verification status for Push, Voice, and MagicLink factors. Use after activate_factor for these factor types. Poll periodically until status changes to approved/denied. Returns verification status indicating whether user approved the push or completed voice/magiclink.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        verification_id: {
          type: 'string',
          description: 'Verification ID from activate_factor response'
        }
      },
      required: ['user_id', 'verification_id'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_factor',
    description: 'Remove an enrolled MFA factor (device) from a user. Requires device_id from get_enrolled_factors. Returns 204 No Content on success. WARNING: This cannot be undone - user will need to re-enroll the factor.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        device_id: {
          type: 'string',
          description: 'Device ID from get_enrolled_factors response'
        }
      },
      required: ['user_id', 'device_id'],
      additionalProperties: false
    }
  },
  {
    name: 'generate_mfa_token',
    description: 'Generate temporary MFA bypass token for account recovery when MFA device is lost. Token can be used in place of MFA for set time period. expires_in defaults to 259200 seconds (72 hours max). reusable defaults to false (single use). Returns mfa_token string, expires_at timestamp, reusable flag, and device_id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'The OneLogin user ID'
        },
        reusable: {
          type: 'boolean',
          description: 'Whether token can be used multiple times (default: false)'
        },
        expires_in: {
          type: 'number',
          description: 'Token lifetime in seconds (default/max: 259200 = 72 hours)'
        }
      },
      required: ['user_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  get_available_factors: getAvailableFactors,
  get_enrolled_factors: getEnrolledFactors,
  enroll_factor: enrollFactor,
  verify_factor_enrollment_otp: verifyFactorEnrollmentOTP,
  verify_factor_enrollment_poll: verifyFactorEnrollmentPoll,
  activate_factor: activateFactor,
  verify_factor: verifyFactor,
  verify_factor_poll: verifyFactorPoll,
  remove_factor: removeFactor,
  generate_mfa_token: generateMFAToken
};
