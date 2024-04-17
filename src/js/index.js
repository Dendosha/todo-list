import { dbGetTaskByKey, dbGetTaskByIndex, dbGetAllTasks, dbPutTasks, dbUpdateTask, dbDeleteTask, dbClearTasks } from "./blocks/todoIndexedDB.js"

const tasksMap = new Map()
const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')

const tasksList = document.getElementById('tasks-list')
const completedTasksList = document.getElementById('completed-tasks-list')
const deletedTasksList = document.getElementById('deleted-tasks-list')

const dbLocalClearButton = document.querySelector('.user__clear-all-tasks')

dbLocalClearButton.addEventListener('click', async function (e) {
	await dbClearTasks()

	for (const [task, taskInfo] of tasksMap.entries()) {
		deleteTask(task, taskInfo, true)
		tasksMap.delete(task)
	}
})

taskForm.addEventListener('submit', async function (e) {
	e.preventDefault()

	const task = await createTask(taskInput.value)

	taskForm.reset()

	// tasksList.append(task)
	// task.classList.add('--expanded')
	// updateTaskTextHeight(tasksMap.get(task).taskText)
})

document.addEventListener('DOMContentLoaded', async function (e) {
	const response = await dbGetAllTasks()
	response.result.forEach(task => {
		if (task.deleted) {
			renderTask(task.taskText, task.id, deletedTasksList)
		} else if (task.completed) {
			renderTask(task.taskText, task.id, completedTasksList)
		} else {
			renderTask(task.taskText, task.id)
		}
	})
})

async function createTask(text) {
	const response = await dbPutTasks([
		{ taskText: text, completed: false, deleted: false },
	])

	return renderTask(text, response.result[0].key)
}

function renderTask(text, id = null, list = tasksList) {
	const taskElement = document.createElement('li')
	const taskWrapper = document.createElement('div')
	const taskText = document.createElement('textarea')
	const taskEditButton = document.createElement('button')
	const taskCompleteButton = document.createElement('button')
	const taskRecoverButton = document.createElement('button')
	const taskDeleteButton = document.createElement('button')

	taskElement.classList.add('tasks-list__item')
	taskWrapper.classList.add('tasks-list__item-wrapper')

	taskText.classList.add('tasks-list__item-text', 'interactive-element')
	taskText.setAttribute('disabled', '')
	taskText.innerText = text
	taskText.style.resize = 'none'

	taskEditButton.classList.add('tasks-list__item-button', 'tasks-list__edit-button', 'interactive-element')
	taskCompleteButton.classList.add('tasks-list__item-button', 'tasks-list__complete-button', 'interactive-element')
	taskRecoverButton.classList.add('tasks-list__item-button', 'tasks-list__recover-button', 'interactive-element')
	taskDeleteButton.classList.add('tasks-list__item-button', 'tasks-list__delete-button', 'interactive-element')

	taskEditButton.type = 'button'
	taskCompleteButton.type = 'button'
	taskRecoverButton.type = 'button'
	taskDeleteButton.type = 'button'

	taskEditButton.setAttribute('data-type', 'edit')
	taskCompleteButton.setAttribute('data-type', 'complete')
	taskRecoverButton.setAttribute('data-type', 'recover')
	taskDeleteButton.setAttribute('data-type', 'delete')

	taskEditButton.innerHTML = '<img src="img/icons/edit.svg" alt="Редактировать" class="tasks-list__item-button-img">'
	taskCompleteButton.innerHTML = '<img src="img/icons/complete.svg" alt="Выполнить" class="tasks-list__item-button-img">'
	taskRecoverButton.innerHTML = '<img src="img/icons/recover.svg" alt="Вернуть в список задач" class="tasks-list__item-button-img">'
	taskDeleteButton.innerHTML = '<img src="img/icons/cross.svg" alt="Удалить" class="tasks-list__item-button-img">'

	taskRecoverButton.style.display = 'none'

	taskElement.append(taskWrapper)
	taskWrapper.append(taskText, taskEditButton, taskRecoverButton, taskCompleteButton, taskDeleteButton)

	list.append(taskElement)
	taskElement.classList.add('--expanded')
	updateTaskTextHeight(taskText)

	tasksMap.set(taskElement, {
		id,
		taskWrapper,
		taskText,
		taskEditButton,
		taskRecoverButton,
		taskCompleteButton,
		taskDeleteButton
	})

	taskElement.addEventListener('click', taskClickHandler)

	taskText.addEventListener('keydown', (e) => {
		if (!e.shiftKey && e.key === 'Enter') {
			toggleEditState(tasksMap.get(taskElement))
		} else if (e.shiftKey && e.key === 'Enter') {
			updateTaskTextHeight(e.currentTarget)
		}
	})

	taskText.addEventListener('input', (e) => updateTaskTextHeight(e.currentTarget))

	return taskElement
}

async function editTask(taskInfo) {
	await dbUpdateTask(taskInfo.id, 'taskText', taskInfo.taskText.value)
}

async function completeTask(task, taskInfo) {
	await dbUpdateTask(taskInfo.id, 'completed', true)

	task.classList.add('--wrapped')

	task.addEventListener('animationend', (e) => {
		completedTasksList.append(task)
		task.classList.remove('--wrapped')
		task.classList.add('--expanded')

		taskInfo.taskEditButton.style.display = 'none'
		taskInfo.taskCompleteButton.style.display = 'none'
		taskInfo.taskRecoverButton.style.display = 'flex'
	}, { once: true, })
}

async function deleteTask(task, taskInfo, isFinalDeletion = false) {
	if (task.closest('ul').id === 'deleted-tasks-list') {
		isFinalDeletion = true
	}

	if (isFinalDeletion) {
		await dbDeleteTask(taskInfo.id)

		task.classList.add('--wrapped')

		task.addEventListener('animationend', (e) => {
			task.remove()
		}, { once: true, })
	} else {
		await dbUpdateTask(taskInfo.id, 'deleted', true)

		task.classList.add('--wrapped')

		task.addEventListener('animationend', (e) => {
			deletedTasksList.append(task)
			task.classList.remove('--wrapped')
			task.classList.add('--expanded')

			taskInfo.taskEditButton.style.display = 'none'
			taskInfo.taskCompleteButton.style.display = 'none'
			taskInfo.taskRecoverButton.style.display = 'flex'
		}, { once: true, })
	}
}

async function recoverTask(task, taskInfo) {
	const response = await dbGetTaskByKey(taskInfo.id)

	task.classList.add('--wrapped')

	task.addEventListener('animationend', function (e) {
		if (response?.result?.deleted && response?.result?.completed) {
			moveTaskToList(task, taskInfo, completedTasksList, {
				editButton: 'none',
				completeButton: 'none',
				recoverButton: 'flex',
				deleteButton: 'flex',
			})
		} else {
			moveTaskToList(task, taskInfo, tasksList, {
				editButton: 'flex',
				completeButton: 'flex',
				recoverButton: 'none',
				deleteButton: 'flex',
			})
		}
	}, { once: true, })
}

async function moveTaskToList(task, taskInfo, list, options) {
	if (list === tasksList) {
		await dbUpdateTask(taskInfo.id, 'completed', false)
	}

	await dbUpdateTask(taskInfo.id, 'deleted', false)

	list.append(task)

	task.classList.remove('--wrapped')
	task.classList.add('--expanded')

	taskInfo.taskEditButton.style.display = options.editButton
	taskInfo.taskCompleteButton.style.display = options.completeButton
	taskInfo.taskRecoverButton.style.display = options.recoverButton
	taskInfo.taskDeleteButton.style.display = options.deleteButton
}

async function toggleEditState(taskInfo) {
	const innerImg = taskInfo.taskEditButton.querySelector('img')

	if (innerImg.alt === 'Редактировать') {
		innerImg.src = 'img/icons/save.svg'
		innerImg.alt = 'Сохранить'

		taskInfo.taskText.removeAttribute('disabled')
		taskInfo.taskText.style.resize = 'vertical'

		taskInfo.taskText.focus()

		taskInfo.taskText.selectionStart = taskInfo.taskText.value.length

		taskInfo.taskDeleteButton.setAttribute('disabled', '')
		taskInfo.taskCompleteButton.setAttribute('disabled', '')
		taskInfo.taskRecoverButton.setAttribute('disabled', '')
	} else if (innerImg.alt === 'Сохранить') {
		innerImg.src = 'img/icons/edit.svg'
		innerImg.alt = 'Редактировать'

		taskInfo.taskText.setAttribute('disabled', '')
		taskInfo.taskText.style.resize = 'none'

		setTimeout(() => taskInfo.taskEditButton.focus(), 1)

		taskInfo.taskDeleteButton.removeAttribute('disabled')
		taskInfo.taskCompleteButton.removeAttribute('disabled')
		taskInfo.taskRecoverButton.removeAttribute('disabled')

		editTask(taskInfo)
	}
}

function updateTaskTextHeight(taskText) {
	taskText.style.height = `40px`
	if (taskText.scrollHeight > taskText.offsetHeight) {
		taskText.style.height = 'auto'
		taskText.style.height = `${taskText.scrollHeight}px`
	}
}

function taskClickHandler(e) {
	const taskElement = e.target.closest('li.tasks-list__item')
	const button = e.target.closest('button')

	if (!taskElement || !button) return

	const taskInfo = tasksMap.get(taskElement)

	switch (button.getAttribute('data-type')) {
		case 'edit':
			toggleEditState(taskInfo)
			break
		case 'complete':
			completeTask(taskElement, taskInfo)
			break
		case 'recover':
			recoverTask(taskElement, taskInfo)
			break
		case 'delete':
			deleteTask(taskElement, taskInfo)
			break
	}
}

import "./blocks/info-dialog.js"