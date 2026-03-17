const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:WxvP5VGncKp1GjJq@db.szbngxwehcafqfipvspi.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected.');
    
    console.log('Reading schema file...');
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
    
    console.log('Executing schema...');
    await client.query(sql);
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
