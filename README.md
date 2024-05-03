# Dog Social API

This repository contains the API for a social network dedicated to dog lovers.

## Usage

To start the project, run the following command:

```bash
npm start
```

To run the project in development mode with automatic restart, use:

```bash
npm run dev
```

## Docker Containers

The project includes Docker Compose for managing containers. To run the entire project with Docker Compose, use the following command:

```bash
docker-compose up
```

If you only want to spin up the database and access it locally, you can do so by running the following command:

```bash
docker-compose up -d postgres run-migrations
```

## Linting and Formatting

The project uses xo and redocly to enforce a consistent code style. To check for linting errors, run:

```bash
npm run lint
```

To automatically fix many of the linting errors, you can run:

```bash
npm run format
```

## Testing

To run the tests for the project, use:

```bash
npm test
```

## Preview API Documentation

Use Redocly to preview the OpenAPI documentation locally by running:

```bash
npm run openapi:preview
```

## Project Structure

The project utilizes workspaces to manage multiple packages, including libraries and services. The specific workspace directories are:

- `lib/*`: Libraries or shared code across services.
- `services/*`: Individual service applications.

## Requirements

This project requires Node.js version 20.9.0 or higher.
