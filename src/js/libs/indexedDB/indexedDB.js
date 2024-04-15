const indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB ||
	window.shimIndexedDB;

export function connectDB(databaseName, version, upgradeCallback = null) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(databaseName, version)

		request.onerror = function (e) {
			reject(e)
		}

		request.onupgradeneeded = function (e) {
			const db = e.target.result
			upgradeCallback?.(db)
		}

		request.onsuccess = function (e) {
			resolve(request.result)
		}
	})
}

export function createObjectStore(storeName, storeIndexes = [], keyPath = 'id', autoIncrement = true, db) {
	const store = db.createObjectStore(storeName, {
		keyPath: keyPath,
		autoIncrement: autoIncrement,
	})

	storeIndexes.forEach(storeIndex => {
		store.createIndex(storeIndex[0], storeIndex[1], storeIndex[2])
	})
}

export function clearObjectStore(storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'clear',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readwrite')
		const store = transaction.objectStore(storeName)
		const clearRequest = store.clear()

		clearRequest.onerror = function (e) {
			response.error = e
			reject(response)
		}

		clearRequest.onsuccess = function (e) {
			response.result = { clearedStore: storeName }
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}

export function getEntryByKey(keyValue, storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'get',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readonly')

		const store = transaction.objectStore(storeName)
		const getRequest = store.get(keyValue)

		getRequest.onerror = function (e) {
			response.error = e
			reject(response)
		}

		getRequest.onsuccess = function (e) {
			response.result = getRequest.result
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}

export function getEntryByIndex(indexName, indexValue, all, storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'get',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readonly')

		const store = transaction.objectStore(storeName)
		const searchIndex = store.index(indexName)
		let searchRequest

		if (all) {
			searchRequest = searchIndex.getAll(indexValue)
		} else {
			searchRequest = searchIndex.get(indexValue)
		}

		searchRequest.onerror = function (e) {
			response.error = e
			reject(response)
		}

		searchRequest.onsuccess = function (e) {
			response.result = searchRequest.result
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}

export function getAllEntries(storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'get',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readonly')

		const store = transaction.objectStore(storeName)
		const getRequest = store.getAll()

		getRequest.onerror = function (e) {
			response.error = e
			reject(response)
		}

		getRequest.onsuccess = function (e) {
			response.result = getRequest.result
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}

export function putEntries(storeEntries = [], storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'put',
			result: [],
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readwrite')
		const store = transaction.objectStore(storeName)

		storeEntries.forEach(storeEntry => {
			const putRequest = store.put(storeEntry)

			putRequest.onsuccess = function (e) {
				storeEntry.key = putRequest.result
				response.result.push(storeEntry)
			}
		})

		transaction.onerror = function (e) {
			response.result = null
			response.error = e

			reject(response)
		}

		transaction.oncomplete = function (e) {
			response.ok = true

			db.close()

			resolve(response)
		}
	})
}

export function updateEntry(keyValue, indexName, indexValue, storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'update',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readwrite')

		const store = transaction.objectStore(storeName)
		const updateRequest = store.get(keyValue)

		updateRequest.onerror = function (e) {
			response.error = e
			reject(response)
		}

		updateRequest.onsuccess = function (e) {
			updateRequest.result[indexName] = indexValue
			store.put(updateRequest.result)

			response.result = updateRequest.result
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}

export function deleteEntry(keyValue, storeName, db) {
	return new Promise((resolve, reject) => {
		const response = {
			queryType: 'delete',
			result: null,
			error: null,
			ok: false,
		}

		const transaction = db.transaction(storeName, 'readwrite')

		const store = transaction.objectStore(storeName)
		const deleteRequest = store.delete(keyValue)

		transaction.onerror = function (e) {
			response.error = e
			reject(response)
		}

		deleteRequest.onsuccess = function (e) {
			response.result = keyValue
			response.ok = true

			resolve(response)
		}

		transaction.oncomplete = function (e) {
			db.close()
		}
	})
}