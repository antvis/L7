import { exec as run, xspec, expect, stdout } from './utils'

import { exec, ln } from 'shelljs'

xspec(__filename, async function(_env, done) {
	this.timeout(5 * 60 * 1000)

	exec('rimraf package.json')
	exec('git clone --depth 1 https://github.com/angularclass/angular2-webpack-starter.git .')
	exec('yarn install')
	exec('rimraf node_modules/awesome-typescript-loader')
	ln('-s', _env.LOADER, './node_modules/awesome-typescript-loader')

	const wp = run('npm', ['run', 'webpack'])

	await wp.wait(stdout('[at-loader] Ok'))

	const code = await wp.alive()
	expect(code).eq(0)

	done()
})
