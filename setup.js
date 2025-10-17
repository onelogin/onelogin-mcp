#!/usr/bin/env bun
import { loadServers, addServer, saveConfig } from './lib/config.js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n= OneLogin MCP Setup');
  console.log('='.repeat(50));

  const servers = loadServers();
  const existingServers = Object.keys(servers);

  if (existingServers.length > 0) {
    console.log('\nExisting servers:');
    existingServers.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name} (${servers[name].url})`);
    });
    console.log('');
  }

  const name = await question('Server name (e.g., "Production", "Chicken-Shadow"): ');
  if (!name || name.trim() === '') {
    console.log('L Server name is required');
    process.exit(1);
  }

  const url = await question('Server URL (e.g., "https://company.onelogin.com"): ');
  if (!url || url.trim() === '') {
    console.log('L Server URL is required');
    process.exit(1);
  }

  // Remove trailing slash if present
  const cleanUrl = url.trim().replace(/\/$/, '');

  const clientId = await question('OAuth2 Client ID: ');
  if (!clientId || clientId.trim() === '') {
    console.log('L Client ID is required');
    process.exit(1);
  }

  const clientSecret = await question('OAuth2 Client Secret: ');
  if (!clientSecret || clientSecret.trim() === '') {
    console.log('L Client Secret is required');
    process.exit(1);
  }

  const legacyKey = await question('Legacy API Key (optional, press Enter to skip): ');

  // Save the server
  addServer(name.trim(), {
    url: cleanUrl,
    client_id: clientId.trim(),
    client_secret: clientSecret.trim(),
    legacy_key: legacyKey.trim()
  });

  console.log(`\n Server '${name.trim()}' saved!`);

  // Ask if this should be the active server
  const setActive = await question('\nSet this as the active server? (y/n): ');
  if (setActive.toLowerCase() === 'y' || setActive.toLowerCase() === 'yes') {
    saveConfig({
      active_server: name.trim(),
      use_preprod: false
    });
    console.log(` '${name.trim()}' is now the active server`);
  }

  // Ask if they want to add another
  const addAnother = await question('\nAdd another server? (y/n): ');
  if (addAnother.toLowerCase() === 'y' || addAnother.toLowerCase() === 'yes') {
    // Don't close rl, just re-run main
    await main();
  } else {
    console.log('\n🎉 Setup complete!');
    console.log('\nNext steps:');
    console.log('  1. Add to Claude Code config: ~/.config/claude/config.json');
    console.log('  2. Restart Claude Code');
    console.log('  3. Try: "List my OneLogin users"');
    rl.close();
  }
}

main().catch((error) => {
  console.error('\nL Error:', error.message);
  rl.close();
  process.exit(1);
});
