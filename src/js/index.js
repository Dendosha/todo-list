// window.addEventListener('visibilitychange', sendData)
// window.addEventListener('pagehide', sendData)

// function sendData() {
// 	if (document?.visibilityState === 'hidden') {
// 		console.log(1)
// 	}
// }

const tasksMap = new Map()
const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')

const tasksList = document.getElementById('tasks-list')
const completedTasksList = document.getElementById('completed-tasks-list')
const deletedTasksList = document.getElementById('deleted-tasks-list')

taskForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const task = createTask(taskInput.value)

	taskForm.reset()

	tasksList.append(task)
	task.classList.add('--expanded')
	updateTaskTextHeight(tasksMap.get(task).taskText)
})

function createTask(text) {
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
	taskDeleteButton.innerHTML = '<img src="img/icons/delete.svg" alt="Удалить" class="tasks-list__item-button-img">'

	taskRecoverButton.style.display = 'none'

	taskElement.append(taskWrapper)
	taskWrapper.append(taskText, taskEditButton, taskRecoverButton, taskCompleteButton, taskDeleteButton)

	tasksMap.set(taskElement, {
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

	const children = tasksMap.get(taskElement)

	switch (button.getAttribute('data-type')) {
		case 'edit':
			editTask(taskElement, children)
			break
		case 'complete':
			completeTask(taskElement, children)
			break
		case 'recover':
			recoverTask(taskElement, children)
			break
		case 'delete':
			deleteTask(taskElement, children)
			break
	}
}

function editTask(task, children) {
	toggleEditState(children)
}

function completeTask(task, children) {
	task.classList.add('--wrapped')

	task.addEventListener('animationend', (e) => {
		completedTasksList.append(task)
		task.classList.remove('--wrapped')
		task.classList.add('--expanded')

		children.taskEditButton.style.display = 'none'
		children.taskCompleteButton.style.display = 'none'
		children.taskRecoverButton.style.display = 'flex'
	}, { once: true, })
}

function deleteTask(task, children) {
	if (task.closest('ul').id === 'deleted-tasks-list') {
		task.classList.add('--wrapped')

		task.addEventListener('animationend', (e) => {
			task.remove()
		}, { once: true, })
	} else {
		task.classList.add('--wrapped')

		task.addEventListener('animationend', (e) => {
			deletedTasksList.append(task)
			task.classList.remove('--wrapped')
			task.classList.add('--expanded')

			children.taskEditButton.style.display = 'none'
			children.taskCompleteButton.style.display = 'none'
			children.taskRecoverButton.style.display = 'flex'
		}, { once: true, })
	}
}

function recoverTask(task, children) {
	task.classList.add('--wrapped')

	task.addEventListener('animationend', (e) => {
		tasksList.append(task)
		task.classList.remove('--wrapped')
		task.classList.add('--expanded')

		children.taskEditButton.style.display = 'flex'
		children.taskCompleteButton.style.display = 'flex'
		children.taskRecoverButton.style.display = 'none'
	}, { once: true, })
}

function toggleEditState(children) {
	const innerImg = children.taskEditButton.querySelector('img')

	if (innerImg.alt === 'Редактировать') {
		innerImg.src = 'img/icons/save.svg'
		innerImg.alt = 'Сохранить'

		children.taskText.removeAttribute('disabled')
		children.taskText.style.resize = 'vertical'
		children.taskText.focus()
		children.taskText.selectionStart = children.taskText.value.length

		children.taskDeleteButton.setAttribute('disabled', '')
		children.taskCompleteButton.setAttribute('disabled', '')
		children.taskRecoverButton.setAttribute('disabled', '')
	} else {
		innerImg.src = 'img/icons/edit.svg'
		innerImg.alt = 'Редактировать'

		children.taskText.setAttribute('disabled', '')
		children.taskText.style.resize = 'none'

		children.taskDeleteButton.removeAttribute('disabled')
		children.taskCompleteButton.removeAttribute('disabled')
		children.taskRecoverButton.removeAttribute('disabled')
	}
}