import { src, webpackConfig, tsconfig, compile, expectErrors, expectWarnings, spec } from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        import './empty.d.ts'
    `
	)

	src('empty.d.ts', ``)
	tsconfig()

	const stats = await compile(webpackConfig())
	expectErrors(stats, 0)
	expectWarnings(stats, 1, ['TypeScript declaration files should never be required'])
})
