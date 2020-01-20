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

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader'),
  });

  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    // loaders: [
    //   {
    //     loader: require.resolve('@storybook/addon-storysource/loader'),
    //     options: { parser: 'typescript' },
    //   },
    // ],
    enforce: 'pre',
  },{
    test: /\.stories\.css?$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.stories\.svg$/,
    loader: 'svg-inline-loader'
  }
  );

  config.resolve.extensions.push('.ts', '.tsx', '.js', '.glsl');

  return config;
};
