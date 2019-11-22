import { src, tsconfig, stdout, spec, file, execWebpack } from './utils'

export function config(env) {
	file(
		`webpack.config.js`,
		`
        const path = require('path')
        module.exports = {
			entry: { index: path.join(process.cwd(), '${env.SRC_DIR}', 'index.ts') },
			mode: 'development',
            output: {
                path: path.join(process.cwd(), '${env.OUT_DIR}'),
                filename: '[name].js'
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            },
            module: {
                rules: [
                    {
                        test: /\.(tsx?|jsx?)/,
                        loader: path.resolve(process.cwd(), '..', '..', 'index.js'),
                        include: [ path.join(process.cwd(), '${env.SRC_DIR}') ],
                        query: {
                            silent: true
                        }
                    }
                ]
            }
        }
    `
	)
}

spec(__filename, async function(env, done) {
	src(
		'index.ts',
		`
        export default function sum(a: number, b: number) {
            return a + b;
        }

        sum(1, '1');
    `
	)

	tsconfig()
	config(env)

	const webpack = execWebpack()
	webpack.strictOutput()

	await webpack.wait(
		stdout([
			'ERROR in [at-loader]',
			`Argument of type '"1"' is not assignable to parameter of type 'number'`
		])
	)

	webpack.close()
	done()
})
