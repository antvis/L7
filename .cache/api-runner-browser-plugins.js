module.exports = [{
      plugin: require('../node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"gatsby-starter-default","short_name":"starter","start_url":"/","background_color":"#722ED1","theme_color":"#722ED1","display":"minimal-ui","icon":"/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/@antv/gatsby-theme-antv/site/images/favicon.png"},
    },{
      plugin: require('../node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-layout/gatsby-browser.js'),
      options: {"plugins":[],"component":"/Users/lizhengxue/Documents/AntV/github/L7_2.0/L7/node_modules/@antv/gatsby-theme-antv/site/layouts/layout.tsx"},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[],"color":"#722ED1"},
    },{
      plugin: require('../node_modules/@antv/gatsby-theme-antv/gatsby-browser.js'),
      options: {"plugins":[],"pathPrefix":"/gatsby-theme-antv"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
