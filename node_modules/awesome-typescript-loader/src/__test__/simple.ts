import { src, webpackConfig, tsconfig, compile, checkOutput, expectErrors, spec } from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        class HiThere {
            constructor(a: number, b: string) {
                const t = a + b;
            }
        }
    `
	)

	tsconfig()
	let stats = await compile(webpackConfig())

	expectErrors(stats, 0)
	checkOutput(
		'index.js',
		`
        class HiThere {
            constructor(a, b) {
                const t = a + b;
            }
        }
    `
	)
})
