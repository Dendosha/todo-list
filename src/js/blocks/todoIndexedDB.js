import * as idb from "../libs/indexedDB/indexedDB.js";

const dbIndexes = [
	['taskText', ['taskText'], { unique: false }],
	['completed', ['completed'], { unique: false }],
	['deleted', ['deleted'], { unique: false }],
]

const createTasksObjectStore = idb.createObjectStore.bind(this, 'tasks', dbIndexes, 'id', true)

export async function dbGetTaskByKey(key) {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.getEntryByKey(key, 'tasks', db)

	return response
}

export async function dbGetTaskByIndex(index, searchValue, all = false) {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.getEntryByIndex(index, searchValue, all, 'tasks', db)

	return response
}

export async function dbGetAllTasks() {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.getAllEntries('tasks', db)

	return response
}

export async function dbPutTasks(storeEntries) {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.putEntries(storeEntries, 'tasks', db)

	return response
}

export async function dbUpdateTask(key, index, newValue) {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.updateEntry(key, index, newValue, 'tasks', db)

	return response
}

export async function dbDeleteTask(key) {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.deleteEntry(key, 'tasks', db)

	return response
}

export async function dbClearTasks() {
	const db = await idb.connectDB('todo', 1, createTasksObjectStore)
	const response = await idb.clearObjectStore('tasks', db)

	return response
}