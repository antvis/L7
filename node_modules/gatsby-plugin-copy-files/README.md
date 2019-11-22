Specify absolute `source` path and relative `destination` path using plugin options.

```js
{
	resolve: 'gatsby-plugin-copy-files',
	options: {
		source: `${__dirname}/src/public`,
		destination: ''
	}
},
{
	resolve: 'gatsby-plugin-copy-files',
	options: {
		source: `${__dirname}/src/images`,
		destination: '/images'
	}
}
```

Must be used with `gatsby-source-filesystem`.
