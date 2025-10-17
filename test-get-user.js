#!/usr/bin/env bun
import { getActiveServer } from './lib/config.js';
import { OneLoginApi } from './lib/onelogin-api.js';
import * as userTools from './lib/tools/users.js';

const serverConfig = getActiveServer();
console.error(`Using server: ${serverConfig.name}`);

const api = new OneLoginApi(serverConfig);
const result = await userTools.getUser(api, { user_id: 63697765 });
console.log(JSON.stringify(result, null, 2));
