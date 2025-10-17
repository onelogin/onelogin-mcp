import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const CONFIG_DIR = join(homedir(), '.config', 'onelogin-mcp');
const SERVERS_PATH = join(CONFIG_DIR, 'servers.json');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load all configured servers
 * @returns {Object} Object with server name keys mapping to server configs
 */
export function loadServers() {
  if (!existsSync(SERVERS_PATH)) {
    return {};
  }

  const content = readFileSync(SERVERS_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save servers configuration
 * @param {Object} servers - Servers object
 */
export function saveServers(servers) {
  ensureConfigDir();
  writeFileSync(SERVERS_PATH, JSON.stringify(servers, null, 2));
}

/**
 * Add or update a server
 * @param {string} name - Server name
 * @param {Object} serverConfig - Server configuration
 */
export function addServer(name, serverConfig) {
  const servers = loadServers();
  servers[name] = {
    url: serverConfig.url,
    client_id: serverConfig.client_id,
    client_secret: serverConfig.client_secret,
    legacy_key: serverConfig.legacy_key || ''
  };
  saveServers(servers);
}

/**
 * Remove a server
 * @param {string} name - Server name to remove
 */
export function removeServer(name) {
  const servers = loadServers();
  delete servers[name];
  saveServers(servers);
}

/**
 * Load MCP configuration (active server and preprod setting)
 * @returns {Object|null} Config object or null if not found
 */
export function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return null;
  }

  const content = readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save MCP configuration
 * @param {Object} config - Configuration object
 */
export function saveConfig(config) {
  ensureConfigDir();
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * Get the active server configuration
 * Uses env var ONELOGIN_SERVER or falls back to config file
 * @returns {Object} Server configuration with credentials
 */
export function getActiveServer() {
  const servers = loadServers();

  const serverNames = Object.keys(servers);
  if (serverNames.length === 0) {
    throw new Error(
      'No servers configured. Run `bun run setup` to add a server.'
    );
  }

  const config = loadConfig();

  // Check for environment variable override
  const envServer = process.env.ONELOGIN_SERVER;
  const serverName = envServer || (config && config.active_server);

  if (!serverName) {
    throw new Error(
      'No active server configured. Run `bun run setup` or set ONELOGIN_SERVER env var'
    );
  }

  const server = servers[serverName];
  if (!server) {
    const availableServers = serverNames.join(', ');
    throw new Error(
      `Server '${serverName}' not found. Available servers: ${availableServers}`
    );
  }

  // Check for preprod override
  const usePreprod = process.env.ONELOGIN_USE_PREPROD === 'true' ||
                     (config && config.use_preprod);

  return {
    name: serverName,
    url: server.url,
    client_id: server.client_id,
    client_secret: server.client_secret,
    legacy_key: server.legacy_key,
    use_preprod: usePreprod || false
  };
}
