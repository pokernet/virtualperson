const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// This script helps push your .env.local variables to Vercel
// Usage: node scripts/push-envs.js

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('.env.local not found. Please create it first.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

console.log('Pushing environment variables to Vercel...');

lines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  const [key, ...valueParts] = trimmed.split('=');
  const value = valueParts.join('=');

  if (key && value) {
    try {
      // Push to all environments: production, preview, development
      console.log(`Setting ${key}...`);
      execSync(`vercel env add ${key} ${value} production --force`, { stdio: 'inherit' });
      execSync(`vercel env add ${key} ${value} preview --force`, { stdio: 'inherit' });
      execSync(`vercel env add ${key} ${value} development --force`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`Failed to set ${key}: ${err.message}. Make sure the vercel CLI is installed and you are logged in.`);
    }
  }
});

console.log('Done!');
