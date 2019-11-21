// Native
const path = require('path');

const utilities = {
  getFileExtension: filename => path.parse(filename).ext,
  // eslint-disable-next-line no-console
  handleError: (raiser, error) => console.error(`${raiser} -> ${error}`),
};

module.exports = utilities;
