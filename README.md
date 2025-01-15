# Бэкенд Mesto. Каркас API Mesto

## Используемые технологии и решения

- Typescript в качестве основного языка проекта
- Mongodb и ODM Mongoose для хранения данных пользователей
- Node.js в качестве среды выполнения

## Overview

This project is a TypeScript-based application. Below is a detailed guide on how to run, develop, and manage the codebase using the provided scripts.

## Scripts

### `start`

Runs the application using `ts-node`. This command is used for starting the app in a production-like environment.

```bash
npm run start
```

### `dev`

Runs the application in development mode with `ts-node-dev`. This provides automatic restarts on file changes.

```bash
npm run dev
```

### `build`

Compiles the TypeScript code into JavaScript using the TypeScript compiler (`tsc`). The output can be found in the configured output directory.

```bash
npm run build
```

### `lint`

Runs ESLint to analyze the code for potential issues and ensure it adheres to the project's coding standards.

```bash
npm run lint
```

### `lint:fix`

Runs ESLint with the `--fix` option to automatically correct fixable issues in the code.

```bash
npm run lint:fix
```

### `test`

This is a placeholder for running tests. It currently exits with an error as no tests are specified.

```bash
npm run test
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run start
   ```

## Development

For development purposes, use the `dev` script to enable live reloading.

```bash
npm run dev
```

## Building the Project

To compile the TypeScript files into JavaScript, use the `build` script.

```bash
npm run build
```

## Linting

Ensure code quality and consistency by running the linter.

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

## Testing

Currently, there are no tests specified. You can update the `test` script once tests are added to the project.

```bash
npm run test
```
