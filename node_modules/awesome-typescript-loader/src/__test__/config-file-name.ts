import { src, webpackConfig, tsconfig, compile, expectErrors, spec, query } from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        const a = {}
        const b = Object.values(a);
    `
	)

	tsconfig(
		{
			target: 'es2017'
		},
		undefined,
		'./config/tsconfig.json'
	)

	const config = webpackConfig(
		query({
			configFileName: './config/tsconfig.json'
		})
	)

	let stats = await compile(config)
	expectErrors(stats, 0)
})
