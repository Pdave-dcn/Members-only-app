import pool from "./pool.js";

export async function runQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

export async function runSingle(query, params = []) {
  const rows = await runQuery(query, params);
  return rows[0] || null;
}
