import {src, webpackConfig, tsconfig, compile, checkOutput, expectErrors, spec, expect, query} from './utils'

[true, false].forEach(transpileOnly => {
	spec(`${__filename}-transpileOnly:${transpileOnly}`, async function() {
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
		let getCustomTransformersCalled = false
		let stats = await compile(webpackConfig(query({
			transpileOnly,
			getCustomTransformers: program => {
				expect(typeof program.getTypeChecker === 'function').true
				getCustomTransformersCalled = true
				return {};
			}
		})))

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
		expect(getCustomTransformersCalled).true
	})
})
