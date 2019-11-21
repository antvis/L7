import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as zlib from 'zlib'
import { createHash } from 'crypto'

export interface CompiledModule {
	fileName: string
	text: string
	map?: string
	mapName?: string
}

export function findCompiledModule(fileName: string): CompiledModule {
	let baseFileName = fileName.replace(/(\.ts|\.tsx)$/, '')
	let compiledFileName = `${baseFileName}.js`

	if (fs.existsSync(compiledFileName)) {
		let mapFileName = `${baseFileName}.js.map`
		let isMapExists = fs.existsSync(mapFileName)
		let result = {
			fileName: compiledFileName,
			text: fs.readFileSync(compiledFileName).toString(),
			mapName: isMapExists ? mapFileName : null,
			map: isMapExists ? fs.readFileSync(mapFileName).toString() : null
		}
		return result
	} else {
		return null
	}
}

/**
 * Read the contents from the compressed file.
 */
function read(filename: string) {
	let content = fs.readFileSync(filename)
	let jsonString = zlib.gunzipSync(content)
	return JSON.parse(jsonString.toString())
}

/**
 * Write contents into a compressed file.
 *
 * @params {String} filename
 * @params {String} result
 */
function write(filename: string, result: any) {
	let jsonString = JSON.stringify(result)
	let content = zlib.gzipSync(jsonString as any)
	return fs.writeFileSync(filename, content)
}

/**
 * Build the filename for the cached file
 *
 * @params {String} source  File source code
 * @params {Object} options Options used
 *
 * @return {String}
 */
function filename(source: string, identifier, options) {
	let hash = createHash('sha512') as any
	let contents = JSON.stringify({
		identifier: identifier,
		options: options,
		source: source
	})

	hash.end(contents)

	return hash.read().toString('hex') + '.json.gzip'
}

export interface CacheParams<T> {
	source: string
	options: any
	transform: () => Promise<T>
	identifier: any
	directory: string
}

/**
 * Retrieve file from cache, or create a new one for future reads
 */
export function cache<T>(params: CacheParams<T>): Promise<{ cached: boolean; result: T }> {
	// Spread params into named variables
	// Forgive user whenever possible
	let source = params.source
	let options = params.options || {}
	let transform = params.transform
	let identifier = params.identifier
	let directory = typeof params.directory === 'string' ? params.directory : os.tmpdir()

	let file = path.join(directory, filename(source, identifier, options))

	try {
		// No errors mean that the file was previously cached
		// we just need to return it
		return Promise.resolve({ cached: true, result: read(file) })
	} catch (e) {
		// Otherwise just transform the file
		// return it to the user asap and write it in cache
		return transform().then(result => {
			write(file, result)
			return { cached: false, result }
		})
	}
}
