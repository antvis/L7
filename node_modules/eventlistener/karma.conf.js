module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon', 'referee'],
    files: [
      '*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,

    // Continuous Integration mode
    singleRun: true,
    client: {
      mocha: {
        ui: 'tdd'
      }
    }
  });
};
