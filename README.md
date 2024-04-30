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

To build and run the user-service in a Docker container, use the following commands:

```bash
docker build -t dog-social-api/user-service -f services/user-service/Dockerfile .
docker run -p 3000:3000 --name dog-social-api-user-service -d dog-social-api/user-service
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
