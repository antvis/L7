# gatsby-remark-prettier

Format code blocks in markdown files using
[Prettier](https://prettier.io/).

## Install

`npm install --save gatsby-transformer-remark gatsby-remark-prettier prettier`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-prettier`,
          options: {
            // Look for local .prettierrc file.
            // The same as `prettier.resolveConfig(process.cwd())`
            usePrettierrc: true,
            // Overwrite prettier options, check out https://prettier.io/docs/en/options.html
            prettierOptions: {}
          },
        },
        // any highlight plugin should be after
        `gatsby-remark-prismjs`,
      ],
    },
  },
]
```
