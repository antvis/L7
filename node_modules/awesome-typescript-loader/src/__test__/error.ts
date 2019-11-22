import { src, webpackConfig, tsconfig, compile, checkOutput, expectErrors, spec } from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        function sum(a: number, b: number) {
            return a + b;
        }

        sum('test', 1);
    `
	)

	tsconfig()

	let stats = await compile(webpackConfig())

	expectErrors(stats, 1, [
		'./src/index.ts',
		`Argument of type '"test"' is not assignable to parameter of type 'number'`
	])

	checkOutput(
		'index.js',
		`
        function sum(a, b) {
            return a + b;
        }

        sum('test', 1);
    `
	)
})
