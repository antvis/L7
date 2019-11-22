# gatsby-remark-reading-time

Adds a medium-like reading time estimate to your gatsby remark posts. Powered by [`reading-time`](https://github.com/ngryman/reading-time).

## Installation

1. Install

```bash
yarn add gatsby-remark-reading-time
```

2. Add to `gatsby-transformer-remark` plugins in `gatsby-config.js`

```jsx
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `gatsby-remark-reading-time`,
        // ...
      ],
    },
  },
```

## Usage

The reading time can be queried in the fields of markdownRemark nodes. An example of this in a single post would look like this:

```jsx
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      excerpt(pruneLength: 200)
      frontmatter {
        title
        date(formatString: "MMMM Do, YYYY")
      }
      fields {
        slug
        readingTime {
          text
        }
      }
    }
  }
`;
```

There are 4 available values in `readingTime`:

- `text`: '1 min read',
- `minutes`: 1,
- `time`: 60000,
- `words`: 200

## License

MIT
