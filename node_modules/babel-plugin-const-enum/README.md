# babel-plugin-const-enum

> Transform TypeScript `const` enums

## Install

Using npm:

```sh
npm install --save-dev babel-plugin-const-enum
```

or using yarn:

```sh
yarn add babel-plugin-const-enum --dev
```

## Usage

### `removeConst` (default)

Removes the `const` keyword to use regular `enum`.
Can be used in a slower dev build to allow `const`, while prod still uses `tsc`.
See [babel#6476](https://github.com/babel/babel/issues/6476).

```ts
// Before:
const enum MyEnum {
  A = 1,
  B = A,
  C,
  D = C,
  E = 1,
  F,
  G = A * E,
  H = A ** B ** C,
  I = A << 20
}

// After:
enum MyEnum {
  A = 1,
  B = A,
  C,
  D = C,
  E = 1,
  F,
  G = A * E,
  H = A ** B ** C,
  I = A << 20
}
```

`.babelrc`
```json
{
  "plugins": [
    "const-enum"
  ]
}
```

Or Explicitly:

`.babelrc`
```json
{
  "plugins": [
    [
      "const-enum",
      {
        "transform": "removeConst"
      }
    ]
  ]
}
```

### `constObject`

Transforms into a `const` object literal.
Can be further compressed using Uglify/Terser to inline `enum` access.
See [babel#8741](https://github.com/babel/babel/issues/8741).

```ts
// Before:
const enum MyEnum {
  A = 1,
  B = A,
  C,
  D = C,
  E = 1,
  F,
  G = A * E,
  H = A ** B ** C,
  I = A << 20
}

// After:
const MyEnum = {
  A: 1,
  B: 1,
  C: 2,
  D: 2,
  E: 1,
  F: 2,
  G: 1,
  H: 1,
  I: 1048576
};
```

`.babelrc`
```json
{
  "plugins": [
    [
      "const-enum",
      {
        "transform": "constObject"
      }
    ]
  ]
}
```
