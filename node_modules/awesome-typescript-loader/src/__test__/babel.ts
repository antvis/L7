import {
	src,
	webpackConfig,
	tsconfig,
	install,
	watch,
	checkOutput,
	expectErrors,
	query,
	spec
} from './utils'

spec(__filename, async function() {
	const index = src(
		'index.ts',
		`
        class HiThere {
            constructor(a: number, b: string) {
                const t = a + b;
            }
        }
    `
	)

	install('babel-core', 'babel-preset-es2015')
	tsconfig()

	const config = webpackConfig(
		query({
			useBabel: true,
			babelOptions: {
				presets: ['es2015']
			}
		})
	)

	const watcher = await watch(config)

	let stats = await watcher.wait()

	expectErrors(stats, 0)
	checkOutput(
		'index.js',
		`
        var HiThere = function HiThere(a, b) {
            _classCallCheck(this, HiThere);
            var t = a + b;
        }
    `
	)

	index.update(
		() => `
        function sum(...items: number[]) {
            return items.reduce((a,b) => a + b, 0);
        }
    `
	)

	stats = await watcher.wait()

	expectErrors(stats, 0)
	checkOutput(
		'index.js',
		`
        function sum() {
            for(var _len = arguments.length,
                items = Array(_len),
                _key = 0;
                _key < _len;
                _key++
            ) {
                items[_key] = arguments[_key];
            }
            return items.reduce(function(a,b){ return a + b; }, 0);
        }
    `
	)
})
