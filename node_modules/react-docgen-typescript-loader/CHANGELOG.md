# Changelog

## [3.5.0] - 2019-11-20

### Added

Thanks @folz: https://github.com/strothj/react-docgen-typescript-loader/pull/72

- Expose the `componentNameResolver` parser option. This allows override the
name resolution for components.

## [3.4.0] - 2019-11-15

### Added

Thanks @patricklafrance: https://github.com/strothj/react-docgen-typescript-loader/pull/69

- Make the name of the `type` property attached to generated docs configurable.

## [3.3.0] - 2019-09-30

### Added

Thanks @evless: https://github.com/strothj/react-docgen-typescript-loader/pull/64

- Default values can be displayed as something other than just string types.

## [3.2.1] - 2019-09-17

### Changed

- Bump `react-docgen-typescript` to `v1.14.1`. [@hipstersmoothie](https://github.com/strothj/react-docgen-typescript-loader/pull/60)

## [3.2.0] - 2019-09-01

### Added

Thanks @nekitk: https://github.com/strothj/react-docgen-typescript-loader/pull/59

- Default values for stateless components can now be generated from props destructuring.
- Passing new parser option (shouldExtractLiteralValuesFromEnum) which allows to parse TypeScript enums and string unions to docgen enum of their values:
  If false (like before): `type: { name: "\"blue\" | \"green\"" }` or `type: { name: "ColorEnum" }`
  If true: type: `{ name: "enum", value: [ { value: "\"blue\"" }, { value: "\"green\""} ] }`

## [3.1.1] - 2019-08-09

### Fix

- Fixed stories are not updated on reload. Thanks @nekitk.
  https://github.com/strothj/react-docgen-typescript-loader/issues/43

## [3.1.0] - 2019-04-02

- Increased performance by reusing TypeScript program instance. Thanks @denieler (https://github.com/strothj/react-docgen-typescript-loader/pull/40)

## [3.0.1] - 2019-01-20

- Republish to resolve potential file permissions issue due to publishing from Windows. Closes [#35](https://github.com/strothj/react-docgen-typescript-loader/issues/35).

## [3.0.0] - 2018-09-20

### Changed

- Bump `react-docgen-typescript` dependency to `v1.9.0`
- Removed the loader options `includes` and `excludes`. Closes [#15](https://github.com/strothj/react-docgen-typescript-loader/issues/15)
- Use the `loader-utils` Webpack page to process loader options. Closes [22](https://github.com/strothj/react-docgen-typescript-loader/issues/22).

## [2.2.0] - 2018-08-11

### Added

- Add the ability to filter props using a filtering function. Thanks @rkostrzewski.
  https://github.com/strothj/react-docgen-typescript-loader/pull/21

## [2.1.1] - 2018-06-13

### Changed

- Bump `react-docgen-typescript` dependency to `v1.6.0`:
  > parse can be called with multiple source file paths (thanks to @marionebl PR #91)  
  > upgraded typescript version and fixed parsing comment problem (thanks to @kbukum PR #97)

## [2.1.0] - 2018-05-27

### Changed

- Bump `react-docgen-typescript` dependency to `v1.5.0`:
  > Remove spread logic.  
  > Support spread default props.  
  > Use folder name if file name is index.  
  > chore(parser): refactor displayName extraction  
  > chore(Parser): read displayName  
  > parse tsconfig.json mirroring TSC’s process  
  > Added support for referenced default props in stateless components  
  > support referenced defaultProps  
  > Extracts default props from stateless components

## [2.0.3] - 2018-03-26

### Fixed

- Bump `react-docgen-typescript` dependency to `v1.2.6`:
  > Fix React.SFC-typed functional components  
  > https://github.com/styleguidist/react-docgen-typescript/commit/e9d57f229b9760967ddc0a746b1c1443f06762b0
- Loader option `setDisplayName` now correctly accepts `false` value.

## [2.0.2] - 2018-03-03

### Fixed

- Use original source text when generating amended code (resolves [#7](https://github.com/strothj/react-docgen-typescript-loader/issues/7)).
