import { src, webpackConfig, expectErrors, tsconfig, compile, file, entry, spec } from './utils'

spec(__filename, async function() {
	file(
		'vendor/with-err.ts',
		`
        export function error(a: number, b: string): number {
            return a + b
        }
    `
	)

	file(
		'vendor/with-err21.ts',
		`
        export function error(a, b)asdf {
            return a + b
        }
    `
	)

	src(
		'index.tsx',
		`
        console.log(1);
    `
	)

	tsconfig(
		{
			jsx: 'react',
			allowJs: true
		},
		{
			exclude: ['vendor']
		}
	)

	let stats = await compile(webpackConfig(entry('index.tsx')))

	expectErrors(stats, 0)
})
