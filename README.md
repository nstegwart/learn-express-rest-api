# learn-nodejs-api

A Node.js API project.

## Prerequisites

- Node.js
- npm or yarn
- PostgreSQL database

## Installation and Running the Application

1. Clone the repository:

git clone https://github.com/your-username/learn-nodejs-api.git
cd learn-nodejs-api

2. Install dependencies:

```sh
npm install
```

or if you're using yarn:

```sh
yarn install
```

3. Set up your PostgreSQL database and update the connection details in your project configuration.

4. Start the server:

```sh
npm start
```

or if you're using yarn:

```sh
yarn start
```

The server will start running on `http://localhost:3000` (or the port you've configured).

## Project Structure

- `server.js`: Main entry point of the application
- `package.json`: Project metadata and dependencies

## Dependencies

- express: Web application framework
- sequelize: ORM for database operations
- pg and pg-hstore: PostgreSQL database driver
- body-parser: Middleware to parse incoming request bodies

## License

This project is licensed under the MIT License.
