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

	const config = webpackConfig()
	config.devtool = 'source-map'

	let stats = await compile(config)

	expectErrors(stats, 0)
	checkOutput('index.js.map', `"file":"index.js"`)
	checkOutput('index.js.map', `"sourcesContent":`)
	checkOutput('index.js.map', `"mappings":`)
})
