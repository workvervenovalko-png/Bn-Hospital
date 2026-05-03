const { Client } = require('pg');

async function testConn() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_lLCPUhFsKy02@ep-soft-mountain-am0fkf5h.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected!');
    const res = await client.query('SELECT current_database()');
    console.log('DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection FAILED:', err.message);
  }
}

testConn();
