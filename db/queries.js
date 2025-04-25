import { runQuery, runSingle } from "./dbUtils.js";

export class DatabaseService {
  async createUser(firstName, lastName, username, passwordHash) {
    const query = `
      INSERT INTO users (
        first_name, last_name, username, password_hash, membership_status, create_at
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    return await runSingle(query, [
      firstName,
      lastName,
      username,
      passwordHash,
      "basic",
      new Date(),
    ]);
  }

  async getUserByUsername(username) {
    return await runSingle("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
  }

  async getPosts() {
    const query = `
      SELECT posts.*, users.first_name, users.last_name, users.username
      FROM posts
      JOIN users ON posts.author_id = users.id
      ORDER BY posts.created_at DESC`;
    return await runQuery(query);
  }

  async createUserPost(title, content, authorId) {
    const query = `
      INSERT INTO posts (title, content, author_id, created_at)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    return await runSingle(query, [title, content, authorId, new Date()]);
  }

  async updateUserMembership(userId, membershipStatus) {
    const query = "UPDATE users SET membership_status = $1 WHERE id = $2";
    await runQuery(query, [membershipStatus, userId]);
  }

  async deletePost(postId) {
    await runQuery("DELETE FROM posts WHERE id = $1", [postId]);
  }
}
