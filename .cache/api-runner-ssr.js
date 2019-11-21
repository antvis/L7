var plugins = [{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-remark-autolink-headers/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-offline/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"gatsby-starter-default","short_name":"starter","start_url":"/","background_color":"#722ED1","theme_color":"#722ED1","display":"minimal-ui","icon":"/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/@antv/gatsby-theme-antv/site/images/favicon.png"},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-layout/gatsby-ssr'),
      options: {"plugins":[],"component":"/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/@antv/gatsby-theme-antv/site/layouts/layout.tsx"},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-148148901-7"},
    },{
      plugin: require('/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/@antv/gatsby-theme-antv/gatsby-ssr'),
      options: {"plugins":[],"GATrackingId":"UA-148148901-7"},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
