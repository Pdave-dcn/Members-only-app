# Members-Only App

The Members-Only App is a Node.js and Express-based web application that allows users to sign up, log in, create posts, and manage membership levels. It uses PostgreSQL for database management and Passport.js for authentication.

## Features

- User authentication (sign up, sign in, and logout).
- Role-based access control (basic, premium, and admin memberships).
- Create, view, and delete posts.
- Membership upgrade functionality (join club and admin privileges).
- Secure session management with PostgreSQL-backed session storage.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/members-only-app.git
cd members-only-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and configure the following environment variables:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=your_database_port
SESSION_SECRET=your_session_secret
CLUB_PASSWORD=your_club_password
ADMIN_PASSWORD=your_admin_password
```

4. Set up the database:

- Create the required tables (`users`, `posts`, and `session`) in your PostgreSQL database.

## Usage

1. Start the application:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
members-only-app/
├── controllers/
│   └── appControllers.js    # Handles application logic
├── db/
│   ├── pool.js              # Database connection pool
│   └── queries.js           # Database queries
├── routes/
│   └── appRoutes.js         # Application routes
├── views/                   # EJS templates for rendering pages
├── app.js                   # Main application entry point
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## Scripts

- `npm start`: Start the application.

## Dependencies

- **bcryptjs**: For password hashing.
- **connect-pg-simple**: PostgreSQL session store for Express.
- **dotenv**: For environment variable management.
- **ejs**: Template engine for rendering views.
- **express**: Web framework for Node.js.
- **express-session**: Session management middleware.
- **express-validator**: Middleware for validating user input.
- **passport**: Authentication middleware.
- **passport-local**: Local authentication strategy for Passport.
- **pg**: PostgreSQL client for Node.js.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Passport.js](http://www.passportjs.org/)
