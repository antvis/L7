import * as _ from 'lodash'
import * as path from 'path'

import { findCompiledModule, cache } from './cache'
import * as helpers from './helpers'
import { QueryOptions, Loader, ensureInstance, Instance, getRootCompiler } from './instance'
import { PathPlugin } from './paths-plugin'
import { CheckerPlugin as _CheckerPlugin } from './watch-mode'

const loaderUtils = require('loader-utils')

function loader(text) {
	try {
		compiler.call(undefined, this, text)
	} catch (e) {
		console.error(e, e.stack)
		throw e
	}
}

namespace loader {
	export const TsConfigPathsPlugin = PathPlugin
	export const CheckerPlugin = _CheckerPlugin
}

interface Transformation {
	text: string
	map: any
	deps: string[]
	fresh?: boolean
}

const DECLARATION = /\.d.ts$/i

function compiler(loader: Loader, text: string): void {
	if (loader.cacheable) {
		loader.cacheable()
	}

	const rootCompiler = getRootCompiler(loader._compiler)

	const query = <QueryOptions>(loaderUtils.getOptions(loader) || {})
	const options = (loader.options && loader.options.ts) || {}
	const instanceName = query.instance || 'at-loader'
	const instance = ensureInstance(loader, query, options, instanceName, rootCompiler)
	const callback = loader.async()

	let fileName = helpers.toUnix(loader.resourcePath)
	instance.compiledFiles[fileName] = true

	if (DECLARATION.test(fileName)) {
		loader.emitWarning(
			new Error(`[${instanceName}] TypeScript declaration files should never be required`)
		)
		return callback(null, '')
	}

	let compiledModule
	if (instance.loaderConfig.usePrecompiledFiles) {
		compiledModule = findCompiledModule(fileName)
	}

	let transformation: Promise<{ cached: boolean; result: Transformation }> = null

	if (compiledModule) {
		transformation = Promise.resolve({
			deps: [],
			text: compiledModule.text,
			map: compiledModule.map ? JSON.parse(compiledModule.map) : null
		}).then(result => ({ cached: true, result }))
	} else {
		const transformationFunction = () => transform(loader, instance, fileName, text)

		if (instance.loaderConfig.useCache) {
			transformation = cache<Transformation>({
				source: text,
				identifier: instance.cacheIdentifier,
				directory: instance.loaderConfig.cacheDirectory,
				options: loader.query,
				transform: transformationFunction
			})
		} else {
			transformation = transformationFunction().then(result => ({ cached: false, result }))
		}
	}

	transformation
		.then(async ({ cached, result }) => {
			const isolated =
				instance.loaderConfig.forceIsolatedModules ||
				instance.compilerConfig.options.isolatedModules

			if (!isolated && result.deps) {
				// If our modules are isolated we don"t need to recompile all the deps
				result.deps.forEach(dep => loader.addDependency(path.normalize(dep)))
			}
			if (cached) {
				// Update file in checker in case we read it from the cache
				const updated = await instance.checker.updateFile(fileName, text)
				if (updated) {
					if (typeof loader._module.meta.tsLoaderFileVersion === 'number') {
						loader._module.meta.tsLoaderFileVersion++
					} else {
						loader._module.meta.tsLoaderFileVersion = 0
					}
				}
			}

			return result
		})
		.then(({ text, map }) => {
			callback(null, text, map)
		})
		.catch(callback)
		.catch(e => {
			console.error('Error in bail mode:', e, e.stack.join ? e.stack.join('\n') : e.stack)
			process.exit(1)
		})
}

function transform(
	webpack: Loader,
	instance: Instance,
	fileName: string,
	text: string
): Promise<Transformation> {
	let resultText
	let resultSourceMap = null

	return instance.checker.emitFile(fileName, text).then(({ emitResult, deps }) => {
		resultSourceMap = emitResult.sourceMap
		resultText = emitResult.text

		let sourceFileName = fileName.replace(instance.context + '/', '')
		if (resultSourceMap) {
			resultSourceMap = JSON.parse(resultSourceMap)
			resultSourceMap.sources = [sourceFileName]
			resultSourceMap.file = sourceFileName
			resultSourceMap.sourcesContent = [text]

			resultText = resultText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '')
		}

		if (instance.loaderConfig.useBabel) {
			let defaultOptions = {
				inputSourceMap: resultSourceMap,
				sourceRoot: instance.context,
				filename: fileName,
				sourceMap: true
			}

			let babelOptions = _.assign({}, defaultOptions, instance.loaderConfig.babelOptions)
			let babelResult = instance.babelImpl.transform(resultText, babelOptions)

			resultText = babelResult.code
			resultSourceMap = babelResult.map
		}

		if (resultSourceMap) {
			let sourcePath = path.relative(
				instance.compilerConfig.options.sourceRoot || instance.context,
				loaderUtils.getRemainingRequest(webpack)
			)

			resultSourceMap.sources = [sourcePath]
			resultSourceMap.file = fileName
			resultSourceMap.sourcesContent = [text]
		}

		if (emitResult.declaration) {
			instance.compiledDeclarations.push(emitResult.declaration)
		}

		return {
			text: resultText,
			map: resultSourceMap,
			deps
		}
	})
}

export = loader
