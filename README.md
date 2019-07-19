# @amjs/api-openapi-reader 0.1.1

![Statements](https://img.shields.io/badge/Statements-100%25-brightgreen.svg) ![Branches](https://img.shields.io/badge/Branches-100%25-brightgreen.svg) ![Functions](https://img.shields.io/badge/Functions-100%25-brightgreen.svg) ![Lines](https://img.shields.io/badge/Lines-100%25-brightgreen.svg)

> Reads an OpenAPI spec file and returns the whole extracted info

## Installation

```bash
$ npm i @amjs/api-openapi-reader
```
## Usage

```javascript
const AmjsApiOpenApiReader = require('@amjs/api-openapi-reader');

const reader = new AmjsApiOpenApiReader('api-spec-path.yaml');
const output = reader.read().parse();
console.log(output); // { collections: [], items: [], paths: [] }
```
## Notice

This package is integrated within [@amjs/api-parser](https://www.npmjs.com/package/@amjs/api-parser),
which is __highly__ suggested to use instead of this package on standalone.
