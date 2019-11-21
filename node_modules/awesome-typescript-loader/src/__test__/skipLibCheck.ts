import { src, webpackConfig, tsconfig, compile, expectErrors, spec } from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        /// <reference path="./index.d.ts" />
        function sum(a: number, b: number) {
            return a + b;
        }

        sum(1, 1);
    `
	)

	src(
		'index.d.ts',
		`
        function sum(a: number, b: number): number;
    `
	)

	tsconfig({
		skipLibCheck: true
	})

	let stats = await compile(webpackConfig())

	expectErrors(stats, 0)

	tsconfig({
		skipLibCheck: false
	})

	stats = await compile(webpackConfig())

	expectErrors(stats, 2, [
		`A 'declare' modifier is required for a top level declaration in a .d.ts file`,
		'Overload signatures must all be exported or non-exported'
	])
})
