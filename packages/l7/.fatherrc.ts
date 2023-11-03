const version = require('./package.json').version;
export default {
  // more father 4 config: 

  esm: {
    output:'es'
  },
  cjs: {
    output:'lib'
  },
  umd:{
    name:'L7',
    output:{
      path:'./dist',
      filename:'l7.js',
      minFile:false
    },
    targets:{
      ie:11

    },
    platform:'browser',
    externals:{
      "mapbox-gl":{
        root:'mapboxgl',
        commonjs:'mapbox-gl',
        commonjs2:'mapbox-gl',
        amd:'mapbox-gl',
      },
      "maplibre-gl":{
        root:'maplibregl',
        commonjs:'maplibre-gl',
        commonjs2:'maplibre-gl',
        amd:'maplibre-gl',
      },
    },
  },

  autoprefixer: {
    browsers: ['IE 11', 'last 2 versions'],
  },
  define:{
    'process.env.VERSION': JSON.stringify(version),
  },

  extraBabelPresets: [
    '@babel/preset-typescript'
  ],
  extraBabelPlugins: [
    // 开发模式下以原始文本引入，便于调试
    [
      // import glsl as raw text
      'babel-plugin-inline-import',
      {
        extensions: [
          '.glsl'
        ]
      }
    ],
    [
      'transform-import-css-l7'
    ],
  ],
};
