import pool from "./pool.js";

const createUsersTable = async () => {
  try {
    // Drop existing table
    await pool.query("DROP TABLE IF EXISTS users");
    console.log("Dropped existing users table");

    const createTableQuery = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        membership_status VARCHAR(50) DEFAULT 'basic',
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  } finally {
    // Don't end the pool here since it's needed for the application
    // await pool.end();
  }
};

// Execute the function
createUsersTable()
  .then(() => console.log("Table setup completed"))
  .catch(console.error);
