export interface MapLike<T> {
	get(key: string): T | undefined
	has(key: string): boolean
	set(key: string, file: T)
	delete(key: string)
	forEach<R>(cb: (v: T, key: string) => R)
	map<R>(cb: (v: T, key: string) => R): R[]
}

export class CaseSensitiveMap<T> implements MapLike<T> {
	private store = new Map<string, T>()
	get(key: string) {
		return this.store.get(key)
	}
	delete(key: string) {
		return this.store.delete(key)
	}
	has(key: string) {
		return this.store.has(key)
	}
	set(key: string, file: T) {
		return this.store.set(key, file)
	}
	forEach<R>(cb: (v: T, key: string) => R) {
		this.store.forEach(cb)
	}
	map<R>(cb: (v: T, key: string) => R): R[] {
		const res = [] as R[]
		this.forEach((v, key) => {
			res.push(cb(v, key))
		})

		return res
	}
}

export class CaseInsensitiveMap<T> implements MapLike<T> {
	private store = new Map<string, T>()
	get(key: string) {
		return this.store.get(key.toLowerCase())
	}
	delete(key: string) {
		return this.store.delete(key.toLowerCase())
	}
	has(key: string) {
		return this.store.has(key.toLowerCase())
	}
	set(key: string, file: T) {
		return this.store.set(key.toLowerCase(), file)
	}
	forEach<R>(cb: (v: T, key: string) => R) {
		this.store.forEach(cb)
	}
	map<R>(cb: (v: T, key: string) => R): R[] {
		const res = [] as R[]
		this.forEach((v, key) => {
			res.push(cb(v, key))
		})

		return res
	}
}
