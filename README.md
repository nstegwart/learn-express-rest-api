# learn-nodejs-api

A Node.js API project.

## Prerequisites

- Docker
- Docker Compose

## Installation and Running the Application

1. Clone the repository:

   git clone https://github.com/your-username/learn-nodejs-api.git
   cd learn-nodejs-api

2. Create a `.env` file in the root directory and add the following environment variables:

   PORT=3000
   POSTGREHOST=your_postgres_host
   POSTGRESUSER=your_postgres_user
   POSTGRESPASSWORD=your_postgres_password
   POSTGRESPORT=your_postgres_port
   POSTGREDB=your_database_name
   JWT_SECRET=your_jwt_secret
   NODEMAIL_EMAIL=your_email@example.com
   NODEMAIL_PASSWORD=your_email_password

   Replace the placeholder values with your actual configuration.

3. Build and start the Docker containers:

   docker-compose up --build

   The server will start running on `http://localhost:3000`.

## Project Structure

- `server.js`: Main entry point of the application
- `package.json`: Project metadata and dependencies
- `Dockerfile`: Instructions for building the Docker image
- `docker-compose.yml`: Docker Compose configuration file
- `.env.local`: Environment variables for local development

## Dependencies

- express: Web application framework
- sequelize: ORM for database operations
- pg and pg-hstore: PostgreSQL database driver
- body-parser: Middleware to parse incoming request bodies
- bcryptjs: Library for hashing passwords
- jsonwebtoken: JSON Web Token implementation
- multer: Middleware for handling multipart/form-data
- nodemailer: Module for sending emails
- dotenv: Module to load environment variables from a file

## Docker Services

- `app`: Node.js application container
- `db`: PostgreSQL database container
- `backup`: Service for automated database backups

## License

This project is licensed under the MIT License.
