import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    return NextResponse.json({ time: res.rows[0].now });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
