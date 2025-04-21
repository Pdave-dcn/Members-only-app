import pool from "./pool.js";

export const createUser = async (
  firstName,
  lastName,
  username,
  passwordHash
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (
        first_name, 
        last_name, 
        username, 
        password_hash, 
        membership_status, 
        create_at
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstName, lastName, username, passwordHash, "basic", new Date()]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const result = await pool.query(
      `SELECT 
        posts.*,
        users.first_name,
        users.last_name,
        users.username
      FROM posts 
      JOIN users ON posts.author_id = users.id 
      ORDER BY posts.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createUserPost = async (title, content, authorId) => {
  try {
    await pool.query(
      "INSERT INTO posts (title, content, author_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, authorId, new Date()]
    );
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updateUserMembership = async (userId, membershipStatus) => {
  try {
    await pool.query("UPDATE users SET membership_status = $1 WHERE id = $2", [
      membershipStatus,
      userId,
    ]);
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
