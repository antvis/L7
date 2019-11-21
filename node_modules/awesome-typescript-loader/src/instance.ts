import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import * as ts from 'typescript'
import * as weblog from 'webpack-log'
import { toUnix } from './helpers'
import { Checker } from './checker'
import { CompilerInfo, LoaderConfig, TsConfig } from './interfaces'
import { WatchModeSymbol } from './watch-mode'
import { createHash } from 'crypto'

import { Compiler } from 'webpack'

import chalk from 'chalk'

const log = weblog({ name: 'atl' })

let pkg = require('../package.json')
let mkdirp = require('mkdirp')
let enhancedResolve = require('enhanced-resolve')

export interface Instance {
	id: number
	babelImpl?: any
	compiledFiles: { [key: string]: boolean }
	compiledDeclarations: { name: string; text: string }[]
	configFilePath: string
	compilerConfig: TsConfig
	loaderConfig: LoaderConfig
	checker: Checker
	cacheIdentifier: string
	context: string

	times: Dict<number>
	watchedFiles?: Set<string>
	startTime?: number
}

export interface Compiler {
	inputFileSystem: typeof fs
	_tsInstances: { [key: string]: Instance }
	options: {
		watch: boolean
	}
}

export interface Loader {
	_compiler: Compiler
	_module: {
		meta: any
	}
	cacheable: () => void
	query: string
	async: () => (err: Error, source?: string, map?: string) => void
	resourcePath: string
	resolve: () => void
	addDependency: (dep: string) => void
	clearDependencies: () => void
	emitFile: (fileName: string, text: string) => void
	emitWarning: (msg: Error) => void
	emitError: (msg: string) => void
	context: string
	options: {
		ts?: LoaderConfig
	}
}

export type QueryOptions = LoaderConfig & ts.CompilerOptions

export function getRootCompiler(compiler) {
	if (compiler.parentCompilation) {
		return getRootCompiler(compiler.parentCompilation.compiler)
	} else {
		return compiler
	}
}

function resolveInstance(compiler, instanceName): Instance {
	if (!compiler._tsInstances) {
		compiler._tsInstances = {}
	}
	return compiler._tsInstances[instanceName]
}

const COMPILER_ERROR = chalk.red(`\n\nTypescript compiler cannot be found, please add it to your package.json file:
    npm install --save-dev typescript
`)

const BABEL_ERROR = chalk.red(`\n\nBabel compiler cannot be found, please add it to your package.json file:
    npm install --save-dev babel-core
`)

let id = 0
export function ensureInstance(
	webpack: Loader,
	query: QueryOptions,
	options: LoaderConfig,
	instanceName: string,
	rootCompiler: any
): Instance {
	let exInstance = resolveInstance(rootCompiler, instanceName)
	if (exInstance) {
		return exInstance
	}

	const watching = isWatching(rootCompiler)
	const context = options.context || process.cwd()

	let compilerInfo = setupTs(query.compiler)
	let { tsImpl } = compilerInfo

	let { configFilePath, compilerConfig, loaderConfig } = readConfigFile(
		context,
		query,
		options,
		tsImpl
	)

	applyDefaults(configFilePath, compilerConfig, loaderConfig, context)

	if (!loaderConfig.silent) {
		const tscVersion = compilerInfo.compilerVersion
		const tscPath = compilerInfo.compilerPath
		log.info(`Using typescript@${chalk.bold(tscVersion)} from ${chalk.bold(tscPath)}`)

		const sync = watching === WatchMode.Enabled ? ' (in a forked process)' : ''
		log.info(`Using ${chalk.bold('tsconfig.json')} from ${chalk.bold(configFilePath)}${sync}`)
	}

	let babelImpl = setupBabel(loaderConfig, context)
	let cacheIdentifier = setupCache(
		compilerConfig,
		loaderConfig,
		tsImpl,
		webpack,
		babelImpl,
		context
	)
	let compiler = <any>webpack._compiler

	if (!rootCompiler.hooks) {
		throw new Error(
			"It looks like you're using an old webpack version without hooks support. " +
				"If you're using awesome-script-loader with React storybooks consider " +
				'upgrading @storybook/react to at least version 4.0.0-alpha.3'
		)
	}

	setupWatchRun(compiler, instanceName)
	setupAfterCompile(compiler, instanceName)

	const webpackOptions = _.pick(webpack._compiler.options, 'resolve')
	const checker = new Checker(
		compilerInfo,
		loaderConfig,
		compilerConfig,
		webpackOptions,
		context,
		watching === WatchMode.Enabled
	)

	return (rootCompiler._tsInstances[instanceName] = {
		id: ++id,
		babelImpl,
		compiledFiles: {},
		compiledDeclarations: [],
		loaderConfig,
		configFilePath,
		compilerConfig,
		checker,
		cacheIdentifier,
		context,
		times: {}
	})
}

function findTsImplPackage(inputPath: string) {
	let pkgDir = path.dirname(inputPath)
	if (fs.readdirSync(pkgDir).find(value => value === 'package.json')) {
		return path.join(pkgDir, 'package.json')
	} else {
		return findTsImplPackage(pkgDir)
	}
}

export function setupTs(compiler: string): CompilerInfo {
	let compilerPath = compiler || 'typescript'

	let tsImpl: typeof ts
	let tsImplPath: string
	try {
		tsImplPath = require.resolve(compilerPath)
		tsImpl = require(tsImplPath)
	} catch (e) {
		console.error(e)
		console.error(COMPILER_ERROR)
		process.exit(1)
	}

	const pkgPath = findTsImplPackage(tsImplPath)
	const compilerVersion = require(pkgPath).version

	let compilerInfo: CompilerInfo = {
		compilerPath,
		compilerVersion,
		tsImpl
	}

	return compilerInfo
}

function setupCache(
	compilerConfig: TsConfig,
	loaderConfig: LoaderConfig,
	tsImpl: typeof ts,
	webpack: Loader,
	babelImpl: any,
	context: string
): string {
	if (loaderConfig.useCache) {
		if (!loaderConfig.cacheDirectory) {
			loaderConfig.cacheDirectory = path.join(context, '.awcache')
		}

		if (!fs.existsSync(loaderConfig.cacheDirectory)) {
			mkdirp.sync(loaderConfig.cacheDirectory)
		}

		let hash = createHash('sha512') as any
		let contents = JSON.stringify({
			typescript: tsImpl.version,
			'awesome-typescript-loader': pkg.version,
			'babel-core': babelImpl ? babelImpl.version : null,
			babelPkg: pkg.babel,
			// TODO: babelrc.json/babelrc.js
			compilerConfig,
			env: process.env.BABEL_ENV || process.env.NODE_ENV || 'development'
		})

		hash.end(contents)
		return hash.read().toString('hex')
	}
}

const resolver = enhancedResolve.create.sync()

function setupBabel(loaderConfig: LoaderConfig, context: string): any {
	let babelImpl: any
	if (loaderConfig.useBabel) {
		try {
			let babelPath = loaderConfig.babelCore || resolver(context, 'babel-core')
			babelImpl = require(babelPath)
		} catch (e) {
			console.error(BABEL_ERROR, e)
			process.exit(1)
		}
	}

	return babelImpl
}

function applyDefaults(
	configFilePath: string,
	compilerConfig: TsConfig,
	loaderConfig: LoaderConfig,
	context: string
) {
	const def: any = {
		sourceMap: true,
		verbose: false,
		skipDefaultLibCheck: true,
		suppressOutputPathCheck: true
	}

	if (compilerConfig.options.outDir && compilerConfig.options.declaration) {
		def.declarationDir = compilerConfig.options.outDir
	}

	_.defaults(compilerConfig.options, def)

	if (loaderConfig.transpileOnly) {
		compilerConfig.options.isolatedModules = true
	}

	_.defaults(compilerConfig.options, {
		sourceRoot: compilerConfig.options.sourceMap ? context : undefined
	})

	_.defaults(loaderConfig, {
		sourceMap: true,
		verbose: false
	})

	delete compilerConfig.options.outDir
	delete compilerConfig.options.outFile
	delete compilerConfig.options.out
	delete compilerConfig.options.noEmit
}

export interface Configs {
	configFilePath: string
	compilerConfig: TsConfig
	loaderConfig: LoaderConfig
}

function absolutize(fileName: string, context: string) {
	if (path.isAbsolute(fileName)) {
		return fileName
	} else {
		return path.join(context, fileName)
	}
}

export function readConfigFile(
	context: string,
	query: QueryOptions,
	options: LoaderConfig,
	tsImpl: typeof ts
): Configs {
	let configFilePath: string
	if (query.configFileName && query.configFileName.match(/\.json$/)) {
		configFilePath = toUnix(absolutize(query.configFileName, context))
	} else {
		configFilePath = tsImpl.findConfigFile(context, tsImpl.sys.fileExists)
	}

	let existingOptions = tsImpl.convertCompilerOptionsFromJson(query, context, 'atl.query')

	if (!configFilePath || query.configFileContent) {
		return {
			configFilePath: configFilePath || toUnix(path.join(context, 'tsconfig.json')),
			compilerConfig: tsImpl.parseJsonConfigFileContent(
				query.configFileContent || {},
				tsImpl.sys,
				context,
				_.extend(
					{},
					tsImpl.getDefaultCompilerOptions(),
					existingOptions.options
				) as ts.CompilerOptions,
				context
			),
			loaderConfig: query as LoaderConfig
		}
	}

	let jsonConfigFile = tsImpl.readConfigFile(configFilePath, tsImpl.sys.readFile)
	let compilerConfig = tsImpl.parseJsonConfigFileContent(
		jsonConfigFile.config,
		tsImpl.sys,
		path.dirname(configFilePath),
		existingOptions.options,
		configFilePath
	)

	return {
		configFilePath,
		compilerConfig,
		loaderConfig: _.defaults(
			query,
			jsonConfigFile.config.awesomeTypescriptLoaderOptions,
			options
		)
	}
}

let EXTENSIONS = /\.tsx?$|\.jsx?$/
export type Dict<T> = { [key: string]: T }

const filterMtimes = (mtimes: any) => {
	const res = {}
	Object.keys(mtimes).forEach(fileName => {
		if (!!EXTENSIONS.test(fileName)) {
			res[fileName] = mtimes[fileName]
		}
	})

	return res
}

function setupWatchRun(compiler, instanceName: string) {
	compiler.hooks.watchRun.tapAsync('at-loader', function(compiler, callback) {
		const instance = resolveInstance(compiler, instanceName)
		const checker = instance.checker
		const watcher = compiler.watchFileSystem.watcher || compiler.watchFileSystem.wfs.watcher

		const startTime = instance.startTime || compiler.startTime
		const times = filterMtimes(watcher.getTimes())
		const lastCompiled = instance.compiledFiles

		instance.compiledFiles = {}
		instance.compiledDeclarations = []
		instance.startTime = startTime

		const set = new Set(Object.keys(times).map(toUnix))
		if (instance.watchedFiles || lastCompiled) {
			const removedFiles = []
			const checkFiles = (instance.watchedFiles || Object.keys(lastCompiled)) as any
			checkFiles.forEach(file => {
				if (!set.has(file)) {
					removedFiles.push(file)
				}
			})

			removedFiles.forEach(file => {
				checker.removeFile(file)
			})
		}

		instance.watchedFiles = set

		const instanceTimes = instance.times
		instance.times = { ...times } as any

		const changedFiles = Object.keys(times).filter(fileName => {
			const updated = times[fileName] > (instanceTimes[fileName] || startTime)
			return updated
		})

		const updates = changedFiles.map(fileName => {
			const unixFileName = toUnix(fileName)
			if (fs.existsSync(unixFileName)) {
				return checker.updateFile(
					unixFileName,
					fs.readFileSync(unixFileName).toString(),
					true
				)
			} else {
				return checker.removeFile(unixFileName)
			}
		})

		Promise.all(updates)
			.then(() => {
				callback()
			})
			.catch(callback)
	})
}

enum WatchMode {
	Enabled,
	Disabled,
	Unknown
}

function isWatching(compiler: any): WatchMode {
	const value = compiler && compiler[WatchModeSymbol]
	if (value === true) {
		return WatchMode.Enabled
	} else if (value === false) {
		return WatchMode.Disabled
	} else {
		return WatchMode.Unknown
	}
}

function setupAfterCompile(compiler, instanceName, forkChecker = false) {
	compiler.hooks.afterCompile.tapAsync('at-loader', function(compilation, callback) {
		// Don"t add errors for child compilations
		if (compilation.compiler.isChild()) {
			callback()
			return
		}

		const watchMode = isWatching(compilation.compiler)
		const instance: Instance = resolveInstance(compilation.compiler, instanceName)
		const silent = instance.loaderConfig.silent
		const asyncErrors = watchMode === WatchMode.Enabled && !silent

		let emitError = msg => {
			if (asyncErrors) {
				console.log(msg, '\n')
			} else {
				if (!instance.loaderConfig.errorsAsWarnings) {
					compilation.errors.push(new Error(msg))
				} else {
					compilation.warnings.push(new Error(msg))
				}
			}
		}

		const files = instance.checker.getFiles().then(({ files }) => {
			Array.prototype.push.apply(compilation.fileDependencies, files.map(path.normalize))
		})

		instance.compiledDeclarations.forEach(declaration => {
			const assetPath = path.relative(compilation.compiler.outputPath, declaration.name)
			compilation.assets[assetPath] = {
				source: () => declaration.text,
				size: () => declaration.text.length
			}
		})

		const timeStart = +new Date()
		const diag = () =>
			instance.loaderConfig.transpileOnly
				? Promise.resolve()
				: instance.checker.getDiagnostics().then(diags => {
						if (!silent) {
							if (diags.length) {
								log.error(
									chalk.red(`Checking finished with ${diags.length} errors`)
								)
							} else {
								let totalTime = (+new Date() - timeStart).toString()
								log.info(`Time: ${chalk.bold(totalTime)}ms`)
							}
						}

						diags.forEach(diag => emitError(diag.pretty))
				  })

		files
			.then(() => {
				if (asyncErrors) {
					diag() // Don"t wait for diags in watch mode
					return
				} else {
					return diag()
				}
			})
			.then(() => callback())
			.catch(callback)
	})
}
