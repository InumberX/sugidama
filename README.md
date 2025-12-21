# Sugidama

![GitHub release (with filter)](https://img.shields.io/github/v/release/InumberX/sugidama) ![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/InumberX/sugidama) ![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/InumberX/sugidama) ![GitHub issues](https://img.shields.io/github/issues/InumberX/sugidama) ![GitHub closed issues](https://img.shields.io/github/issues-closed/InumberX/sugidama) ![GitHub pull requests](https://img.shields.io/github/issues-pr/InumberX/sugidama) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/InumberX/sugidama)

## Overview

This is the repository for my personal development project, 'Sugidama'.

- [Project documentation on DeepWiki](https://deepwiki.com/InumberX/sugidama)

## Development

### Installing packages

```shell
npm install
```

### Execution of development tasks

Execute the following command.

```shell
npm run dev
```

The following URL will take you to the screen.

http://localhost:5173/

- Press `Ctrl + C` to stop

### Syntax Check

#### Check

```shell
npm run lint
```

#### Check and Format

```shell
npm run lint-fix
```

### Formatter

#### Check

```shell
npm run format
```

#### Check and Format

```shell
npm run format-fix
```

### Type Check

```shell
npm run typecheck
```

### Storybook

```shell
npm run storybook
```

### Test(Vitest)

```shell
npm run test
```

### Upgrading packages

#### Check

```shell
npm run upgrade-check
```

#### Upgrade

```shell
npm run upgrade
npm install
```

## API Documentation

### Creating API Types

API type definitions are generated using [quicktype](https://app.quicktype.io).

1. Copy the JSON response from the Kuroco CMS API
2. Paste it into quicktype and select TypeScript as the target language
3. Save the generated types to `app/types/`
