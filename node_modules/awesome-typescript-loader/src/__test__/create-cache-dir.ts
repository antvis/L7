import { src, webpackConfig, tsconfig, compile, expect, query, spec } from './utils'

import * as path from 'path'
import * as fs from 'fs'

spec(__filename, async function() {
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

	const config = webpackConfig(
		query({
			useCache: true,
			// test that we create cache dir
			cacheDirectory: path.join(process.cwd(), 'cache', '.cache')
		})
	)

	await compile(config)

	const exists = fs.existsSync(path.join(process.cwd(), 'cache', '.cache'))
	expect(exists).true
})
