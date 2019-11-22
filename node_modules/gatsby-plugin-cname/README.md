
# gatsby-plugin-cname
[![package version](https://img.shields.io/npm/v/gatsby-plugin-cname.svg?style=flat-square)](https://npmjs.org/package/gatsby-plugin-cname)
[![package downloads](https://img.shields.io/npm/dm/gatsby-plugin-cname.svg?style=flat-square)](https://npmjs.org/package/gatsby-plugin-cname)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/gatsby-plugin-cname.svg?style=flat-square)](https://npmjs.org/package/gatsby-plugin-cname)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Gatsby plugin that automatically creates CNAME file for your site

## Table of Contents

- [Usage](#usage)
- [Install](#install)
- [Contribute](#contribute)
- [Credits](#credits)
- [License](#License)

## Usage

Add to your `gatsby-config.js` file:

```js
module.exports = {
  siteMetadata: {
    siteUrl: 'http://foobar.co.za/'
  },
  plugins: [
    'gatsby-plugin-cname'
  ],
}
```


## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com).

```sh
$ npm install gatsby-plugin-cname
$ # OR
$ yarn add gatsby-plugin-cname
```

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## Credits

Based on [gatsby-plugin-robots-txt](https://github.com/mdreizin/gatsby-plugin-robots-txt).

## License

MIT © Tiaan du Plessis
