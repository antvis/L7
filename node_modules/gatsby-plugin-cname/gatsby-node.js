const fs = require('fs')
const path = require('path')
const url = require('url')

const publicPath = './public';
const defaultEnv = 'development';

const defaultOptions = {
  output: '/CNAME',
  query: `{
    site {
      siteMetadata {
        siteUrl
      }
    }
  }`
};

function writeFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function runQuery(handler, query) {
  return handler(query).then(res => {
    if (res.errors) {
      throw new Error(res.errors.join(', '));
    }

    return res.data;
  });
}

const getOptions = pluginOptions => {
  const options = { ...pluginOptions };

  delete options.plugins;

  const { env = {}, resolveEnv = () => process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV } = options;

  const envOptions = env[resolveEnv()] || env[defaultEnv] || {};

  delete options.env;
  delete options.resolveEnv;

  return { ...options, ...envOptions };
};

module.exports.onPostBuild = async function onPostBuild({ graphql }, pluginOptions) {
  const userOptions = getOptions(pluginOptions);
  const mergedOptions = { ...defaultOptions, ...userOptions };

  if (!mergedOptions.siteUrl) {
    const {
      site: {
        siteMetadata: { siteUrl }
      }
    } = await runQuery(graphql, mergedOptions.query);

    mergedOptions.siteUrl = siteUrl;
  }

  const { output } = mergedOptions;

  const content = url.parse(mergedOptions.siteUrl).host
  const filename = path.join(publicPath, output);

  return await writeFile(path.resolve(filename), content);
}
