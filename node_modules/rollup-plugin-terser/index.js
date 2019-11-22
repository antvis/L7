const { codeFrameColumns } = require("@babel/code-frame");
const Worker = require("jest-worker").default;
const serialize = require("serialize-javascript");
const { createFilter } = require('rollup-pluginutils');

function terser(userOptions = {}) {
  if (userOptions.sourceMap != null) {
    throw Error("sourceMap option is removed, use sourcemap instead");
  }

  const filter = createFilter( userOptions.include, userOptions.exclude, { resolve: false } );

  return {
    name: "terser",

    renderChunk(code, chunk, outputOptions) {
      if(!filter(chunk.fileName)){
        return null;
      }

      if (!this.worker) {
        this.worker = new Worker(require.resolve("./transform.js"), {
          numWorkers: userOptions.numWorkers
        });
        this.numOfBundles = 0;
      }

      this.numOfBundles++;

      // TODO rewrite with object spread after node6 drop
      const normalizedOptions = Object.assign({}, userOptions, {
        sourceMap: userOptions.sourcemap !== false,
        module: outputOptions.format === "es" || outputOptions.format === "esm"
      });

      for (let key of ["include", "exclude", "sourcemap", "numWorkers"]) {
        if (normalizedOptions.hasOwnProperty(key)) {
          delete normalizedOptions[key];
        }
      }

      const serializedOptions = serialize(normalizedOptions);

      const result = this.worker
        .transform(code, serializedOptions)
        .catch(error => {
          const { message, line, col: column } = error;
          console.error(
            codeFrameColumns(code, { start: { line, column } }, { message })
          );
          throw error;
        });

      const handler = () => {
        this.numOfBundles--;

        if (this.numOfBundles === 0) {
          this.worker.end();
          this.worker = 0;
        }
      };

      result.then(handler, handler);

      return result;
    }
  };
}

exports.terser = terser;
