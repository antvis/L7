export const WatchModeSymbol = Symbol('WatchMode')

export class CheckerPlugin {
	apply(compiler) {
		compiler.hooks.run.tapAsync('at-loader', function(params, callback) {
			compiler[WatchModeSymbol] = false
			callback()
		})

		compiler.hooks.watchRun.tapAsync('at-loader', function(params, callback) {
			compiler[WatchModeSymbol] = true
			callback()
		})
	}
}
