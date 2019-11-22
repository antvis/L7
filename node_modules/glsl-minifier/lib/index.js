// Native
const fs = require('fs');

// Vendor
const deparser = require('glsl-deparser');
const minify = require('glsl-min-stream');
const parser = require('glsl-parser');
const tokenizer = require('glsl-tokenizer/stream');
const stringToStream = require('string-to-stream');

// Optimizer
const optimizer = require('./optimizer');

// Arguments
const {
  input, output, shaderType, shaderVersion,
} = require('./argsHandler');

// Constants
const { SUPPORTED_INPUT_TYPES } = require('./constants');

// Utilities
const { getFileExtension, handleError } = require('./utilities');

const optimize = () => {
  const inputFileExtension = getFileExtension(input);

  if (SUPPORTED_INPUT_TYPES.includes(inputFileExtension)) {
    // Read shader
    const inputSource = fs.readFileSync(input, 'utf8');

    // Assume vertex shader if input file extension has `.vert` or if `vertex` is explicity passed
    const isVertexShader = shaderType === 'vertex' || inputFileExtension === '.vert' ? 1 : 0;

    // Run optimizer
    const optimizedSourceCode = optimizer(inputSource, shaderVersion, isVertexShader);

    // Error check the output from GLSL optimizer
    if (optimizedSourceCode.includes('Error:')) {
      // eslint-disable-next-line no-console
      console.error(optimizedSourceCode);
      // eslint-disable-next-line no-console
      console.error('Exiting glsl-minifier!');
      process.exit(-1);
    }

    // Create write stream for the output file
    const outputFile = fs.createWriteStream(output);

    // Run file through a validator, minifier and whitespace trimmer
    stringToStream(optimizedSourceCode)
      .pipe(tokenizer())
      .on('error', error => handleError('Tokenizer', error))
      .pipe(parser())
      .on('error', error => handleError('Parser', error))
      .pipe(minify())
      .on('error', error => handleError('Minify', error))
      .pipe(deparser(false))
      .on('error', error => handleError('Deparser', error))
      .pipe(outputFile);
  } else {
    // eslint-disable-next-line no-console
    console.error(`${inputFileExtension} is not supported.`);
    // eslint-disable-next-line no-console
    console.error(`The supported file extensions are: [${SUPPORTED_INPUT_TYPES}]`);
  }
};

optimize();
