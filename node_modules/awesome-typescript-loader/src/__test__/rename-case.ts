import { src, webpackConfig, tsconfig, watch, expectErrors, xspec } from './utils'

xspec(__filename, async function() {
	const index = src(
		'index.ts',
		`
        import { a } from './MyFIle'
    `
	)

	const file = src(
		'MyFIle.ts',
		`
        export let a: number = '10'
    `
	)

	tsconfig()

	const watcher = watch(webpackConfig())

	{
		let stats = await watcher.wait()
		expectErrors(stats, 1, [`Type '"10"' is not assignable to type 'number'`])
	}

	index.update(text => {
		return `
            import { a } from './MyFile'
        `
	})

	file.move('src/MyFile.ts')

	{
		let stats = await watcher.wait()
		expectErrors(stats, 1, [`Type '"10"' is not assignable to type 'number'`])
	}

	file.update(text => {
		return `
            export let a: number = 10
        `
	})

	{
		let stats = await watcher.wait()
		expectErrors(stats, 0)
	}
})
