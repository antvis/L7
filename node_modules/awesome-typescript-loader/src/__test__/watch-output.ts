import { src, tsconfig, stdout, spec, execWebpack } from './utils'

import { config } from './compile-output'

spec(__filename, async function(env, done) {
	const index = src(
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

	const webpack = execWebpack(['--watch'])
	webpack.strictOutput()

	await webpack.wait(
		stdout('Webpack is watching the files…'),
		stdout([
			'ERROR in [at-loader] ./src/index.ts',
			`TS2345: Argument of type '"1"' is not assignable to parameter of type 'number'`
		])
	)

	index.update(
		() => `
        export default function sum(a: number, b: number) {
            return a + b;
        }

        sum(1, 1);
    `
	)

	await webpack.wait(stdout([[true, '[emitted]'], [false, 'ERROR']]))

	webpack.close()
	done()
})
