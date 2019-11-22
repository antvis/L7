# gatsby-remark-external-links
Adds the target and rel attributes to external links in markdown.

This is a gatsby port of the [remark-external-links](https://github.com/xuopled/remark-external-links) remark plugin.

## Usage 
1. Install plugin to your site:

```bash
yarn add gatsby-remark-external-links
```

2. Add following to your `gatsby-config.js`:
```js
    plugins: [      
      {
        resolve: `gatsby-transformer-remark`,
        options: {
          plugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_self",
              rel: "nofollow"
            }
          }
          ]
        }
      },
```

3. Restart gastby.

## API

#### options

##### target

Type: `string`
Default: `_blank`

Specifies where to display the linked URL.
The value should be on of : `_self`, `_blank`, `_parent`, `_top`

*You can specify `null` to not add the `target` attribute to your links*

##### rel

Type: `string`
Default: `nofollow noopener noreferrer`

Specifies the relationship of the target object to the link object.
The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).

*You can specify `null` to not add the `rel` attribute to your links*

*[When using target, consider adding rel="noopener noreferrer" to avoid exploitation of the window.opener API.](https://developer.mozilla.org/en/docs/Web/HTML/Element/a)*

## License

MIT