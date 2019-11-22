import {
	src,
	webpackConfig,
	tsconfig,
	compile,
	expectErrors,
	spec,
	query,
	file,
	include
} from './utils'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        import 'project/index'
        export let a: number
        a = '10'
    `
	)

	file(
		'node_modules/project/package.json',
		`
        {
            "name": "project",
            "version": "0.0.0",
            "main": "index.ts"
        }
    `
	)

	file(
		'node_modules/project/index.ts',
		`
        export let a: number
        a = '10'
    `
	)

	src(
		'skip.ts',
		`
        export let a: number
        a = '10'
    `
	)

	tsconfig()

	{
		let stats = await compile(
			webpackConfig(
				query({
					reportFiles: ['src/**/*.{ts,tsx}', '!src/skip.ts']
				}),
				include('node_modules')
			)
		)

		expectErrors(stats, 1, ['./src/index.ts', `Type '"10"' is not assignable to type 'number'`])
	}

	{
		let stats = await compile(webpackConfig(include('node_modules')))

		expectErrors(stats, 3, [
			'./src/index.ts',
			`Type '"10"' is not assignable to type 'number'`,
			'./src/skip.ts',
			`Type '"10"' is not assignable to type 'number'`,
			'./node_modules/project/index.ts',
			`Type '"10"' is not assignable to type 'number'`
		])
	}
})
