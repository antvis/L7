import { src, webpackConfig, tsconfig, watch, expectErrors, spec } from './utils'

spec(__filename, async function() {
	const sum = src(
		'sum.ts',
		`
        export default function sum(a: number, b: number) {
            return a + b;
        }
    `
	)

	const index = src(
		'index.ts',
		`
        import sum from './sum'
        sum(1, 1);
    `
	)

	tsconfig()

	const watcher = watch(webpackConfig())

	let stats = await watcher.wait()
	expectErrors(stats, 0)

	sum.update(
		() => `
        export default function sum(a: number, b: string) {
            return a + b;
        }
    `
	)

	stats = await watcher.wait()

	expectErrors(stats, 1, [`Argument of type '1' is not assignable to parameter of type 'string'`])

	index.update(
		() => `
        import sum from './sum'
        sum(1, '1');
    `
	)

	stats = await watcher.wait()

	expectErrors(stats, 0)
})
