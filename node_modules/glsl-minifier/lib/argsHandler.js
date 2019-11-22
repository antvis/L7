// Vendor
const { ArgumentParser } = require('argparse');

// Package
const pkg = require('../package.json');

const createParserArguments = () => {
  const parser = new ArgumentParser({
    version: pkg.version,
    addHelp: true,
    description: pkg.description,
  });

  // File input flag
  parser.addArgument(['-i', '--input'], {
    help: 'Input file including path',
    required: true,
  });

  // File output flag
  parser.addArgument(['-o', '--output'], {
    help: 'Output file including path',
    required: true,
  });

  // Shader type
  parser.addArgument(['-sT', '--shaderType'], {
    choices: ['vertex', 'fragment'],
    help: 'Shader type [vertex shader, fragment shader]',
    defaultValue: 'fragment',
    required: false,
  });

  // Shader version
  parser.addArgument(['-sV', '--shaderVersion'], {
    choices: ['2', '3'],
    help: 'Shader version [OpenGL ES 2.0 (WebGL1), OpenGL ES 3.0 (WebGL2)]',
    defaultValue: 2,
    required: false,
  });

  const args = parser.parseArgs();

  return args;
};

const args = createParserArguments();

module.exports = args;
