const path = require("path");
module.exports = ({ config }) => {

  // config.module.rules.push({
  //   test: /\.glsl$/,
  //   loader: 'raw-loader'
  // });

  // config.module.rules.push({
  //   test: /\.worker\.(js|ts)$/,
  //   use: {
  //     loader: 'worker-loader',
  //     options: { inline: true, fallback: false }
  //   }
  // });
  config.module.rules =[];

  config.module.rules.push(

    {

    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader'),

  });

  config.module.rules.push(
  {
    test: /.css$/,
    use:  ["style-loader", "css-loader", 'sass-loader'],

    enforce: 'pre',
  },
  {
    test: /\.stories\.svg$/,
    loader: 'svg-inline-loader'
  }
  );
  // config.resolve.alias = {
  //   '@antv/l7-district': path.resolve(__dirname, '../packages/boundary/src'),
  // }

  config.resolve.extensions.push('.ts', '.tsx', 'css', '.js', '.glsl');

  return config;
};
