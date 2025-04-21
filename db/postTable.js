import pool from "./pool.js";

const createPostsTable = async () => {
  try {
    // Drop existing table
    await pool.query("DROP TABLE IF EXISTS posts");
    console.log("Dropped existing posts table");

    const createTableQuery = `
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);
    console.log("Posts table created successfully");
  } catch (error) {
    console.error("Error creating posts table:", error);
    throw error;
  }
};

// Execute the function
createPostsTable()
  .then(() => console.log("Table setup completed"))
  .catch(console.error);
