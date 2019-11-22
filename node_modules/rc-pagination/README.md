# rc-pagination
---

React Pagination Component.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies](https://img.shields.io/david/react-component/pagination.svg?style=flat-square)](https://david-dm.org/react-component/pagination)
[![DevDependencies](https://img.shields.io/david/dev/react-component/pagination.svg?style=flat-square)](https://david-dm.org/react-component/pagination?type=dev)
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-pagination.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-pagination
[travis-image]: https://img.shields.io/travis/react-component/pagination.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/pagination
[coveralls-image]: https://img.shields.io/coveralls/react-component/pagination.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/pagination?branch=master
[download-image]: https://img.shields.io/npm/dm/rc-pagination.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-pagination

## Development

```
npm install
npm start
```

## Example

http://localhost:3000/examples/

online example: http://react-component.github.io/pagination/examples/

## Feature

* support ie9,ie9+,chrome,firefox,safari

## Install

[![rc-pagination](https://nodei.co/npm/rc-pagination.png)](https://npmjs.org/package/rc-pagination)

## Usage

```js
var Pagination = require('rc-pagination');
var React = require('react');
React.render(<Pagination />, container);
```

## API

| Parameter        | Description                        | Type          | Default                  |
|------------------|------------------------------------|---------------|--------------------------|
| disabled         | disable pagination                 | Bool          | -                        |
| defaultCurrent   | uncontrolled current page          | Number        | 1                        |
| current          | current page                       | Number        | undefined                |
| total            | items total count                  | Number        | 0                        |
| defaultPageSize  | default items per page             | Number        | 10                       |
| pageSize         | items per page                     | Number        | 10                       |
| onChange         | page change callback               | Function(current, pageSize)      | -     |
| showSizeChanger  | show pageSize changer              | Bool          | false                    |
| pageSizeOptions  | specify the sizeChanger selections | Array<String> | ['10', '20', '30', '40'] |
| onShowSizeChange | pageSize change callback           | Function(current, size)  | -        |
| hideOnSinglePage | hide on single page                | Bool          | false                    |
| showPrevNextJumpers | show jump-prev, jump-next       | Bool          | true                     |
| showQuickJumper  | show quick goto jumper             | Bool / Object | false / {goButton: true} |
| showTotal        | show total records and range            | Function(total, [from, to]) | -     |
| className        | className of pagination            | String        | -                        |
| simple           | when set, show simple pager        | Object        | null                     |
| locale           | to set l10n config                 | Object        | [zh_CN](https://github.com/react-component/pagination/blob/master/src/locale/zh_CN.js) |
| style            | the style of pagination            | Object        | {}                       |
| showLessItems    | show less page items               | Bool          | false                    |
| showTitle        | show page items title              | Bool          | true                     |
| itemRender       | custom page item renderer          | Function(current, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element): React.ReactNode| `(current, type, element) => element` |
| prevIcon        | specifict the default previous icon     | ReactNode \| (props: PaginationProps) => ReactNode          |          |
| nextIcon        | specifict the default previous icon     | ReactNode \| (props: PaginationProps) => ReactNode          |          |
| jumpPrevIcon    | specifict the default previous icon     | ReactNode \| (props: PaginationProps) => ReactNode          |          |
| jumpNextIcon    | specifict the default previous icon     | ReactNode \| (props: PaginationProps) => ReactNode          |          |


## License

rc-pagination is released under the MIT license.
