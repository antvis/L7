const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync(__dirname + '/../../package.json', 'utf8'));
const version = 'v' + pkg.version;
export default version;
