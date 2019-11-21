# gatsby-source-github

[![Build Status](https://travis-ci.org/DSchau/gatsby-source-github.svg?branch=master)](https://travis-ci.org/DSchau/gatsby-source-github)

Source plugin for pulling in Github data (using its [GraphQL API][github-api]) at buildtime for static generation and further GraphQL querying with Gatsby

## Install

```bash
npm install gatsby-source-github --save-dev
```

## How to use

In your `gatsby-config.js`:

```javascript
plugins: [
  {
    resolve: 'gatsby-source-github',
    options: {
      headers: {
        Authorization: `Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
      },
      queries: [
        `{
          repository(owner: "nebraskajs", name: "speaker-signup") {
            issues(last: 20, states: OPEN) {
              edges {
                node {
                  id
                  author {
                    avatarUrl
                    login
                    url
                  }
                  bodyHTML
                  title
                  url
                }
              }
            }
          }
        }`,
      ],
    },
  },
];
```

`queries` is an array of GraphQL queries. The algorithm to generate Gatsby GraphQL nodes is described [below](#the-algorithm)

## How to query

In general, use the [Github API v4 documentation][github-api] and in particular, the [explorer][explorer] to craft your queries and refer to the the [below algorithm](#the-algorithm) for how to query against these results with Gatsby.

### Using variables

Additionally, variables can be used/injectd into the queries. Rather than sending a string in the queries array, send an array like so:

```javascript
[
  `query getViewer($first: Int!) {
    viewer {
      login
      name
      repositories(first:$first) {
        edges {
          node {
            name
          }
        }
      }
    }
  }`,
  { first: 10 },
];
```

### The algorithm

The algorithm is quite simple. It'll descend through the tree/returned structure, and if it finds an `edges` key will use the parent of that as the node name. For instance, in the above `repository` example, `githubIssue` will be the node name, and `allGithubIssues` will be the way to query against all nodes. In the `viewer` example the node name will be `githubViewer`.

All fields in the node that are queried against in the Github GraphQL query are available to be queried with Gatsby. For example, in the `repository` example above, `id`, `author` (and subfields), `bodyHTML`, etc. are available to be queried against.

[github-api]: https://developer.github.com/v4/
[explorer]: https://developer.github.com/v4/explorer/
