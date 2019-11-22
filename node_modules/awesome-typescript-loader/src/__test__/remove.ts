import { src, webpackConfig, tsconfig, watch, expectErrors, spec } from './utils'

spec(__filename, async function() {
	const index = src(
		'index.ts',
		`
        import sum from './sum'
        import mul from './mul'

        sum(1, 1)
        mul(1, 1)
    `
	)

	src(
		'sum.ts',
		`
        export default function sum(a: number, b: number) {
            return a + b;
        }
    `
	)

	const mul = src(
		'mul.ts',
		`
        // function with error
        export default function mul(a: number, b: number) {
            return a * c;
        }
    `
	)

	tsconfig()
	const watcher = await watch(webpackConfig())

	let stats = await watcher.wait()

	expectErrors(stats, 1, [`Cannot find name 'c'`])

	mul.remove()
	index.update(
		() => `
        import sum from './sum'
        sum(1, 1)
    `
	)

	stats = await watcher.wait()
	expectErrors(stats, 0)
})
