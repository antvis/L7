import { src, webpackConfig, tsconfig, compile, expectErrors, spec } from './utils'

import { PathPlugin } from '../paths-plugin'

spec(__filename, async function() {
	src(
		'index.ts',
		`
        import App from 'ui/app'

        const app = new App()
        app.render();
    `
	)

	src(
		'./ui/app/index.ts',
		`
        export default class App { render() { return 'App' } }
    `
	)

	tsconfig({
		baseUrl: '.',
		paths: {
			'ui/*': ['./src/ui/*']
		}
	})

	const config = webpackConfig()
	;(config.resolve as any).plugins = [new PathPlugin()]
	let stats = await compile(config)

	expectErrors(stats, 0)
})
