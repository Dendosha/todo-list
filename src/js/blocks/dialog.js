const pageDialogButtons = document.querySelectorAll('[data-dialog]')

pageDialogButtons.forEach(openDialogButton => {
	const dialog = document.getElementById(openDialogButton.getAttribute('data-dialog'))

	openDialogButton.addEventListener('click', openDialog.bind(this, dialog))
	dialog.querySelector('[data-dialog-close]').addEventListener('click', closeDialog.bind(this, dialog))

	dialog.addEventListener('animationend', (e) => {
		if (dialog.classList.contains('--opening')) {
			dialog.classList.remove('--opening')
		} else if (dialog.classList.contains('--closing')) {
			dialog.close()
			dialog.classList.remove('--closing')
			document.body.classList.remove('--modal-opened')
		}
	})
})

function openDialog(dialog, e) {
	dialog.showModal()
	document.body.classList.add('--modal-opened')
	dialog.classList.add('--opening')
}

function closeDialog(dialog, e) {
	dialog.classList.add('--closing')
}

const dialogPointerInfo = {
	isDown: false,
	isDownOnDialog: false,
	openedDialog: null,
}

document.documentElement.addEventListener('pointerdown', (e) => {
	dialogPointerInfo.isDown = true
	dialogPointerInfo.openedDialog = document.querySelector('dialog[open]')

	if (isOnDialog(dialogPointerInfo.openedDialog, e)) {
		dialogPointerInfo.isDownOnDialog = true
	} else {
		dialogPointerInfo.isDownOnDialog = false
	}
})

document.documentElement.addEventListener('pointerup', (e) => {
	if (!dialogPointerInfo.openedDialog) return

	if (!dialogPointerInfo.isDownOnDialog && !isOnDialog(dialogPointerInfo.openedDialog, e)) {
		dialogPointerInfo.openedDialog.classList.add('--closing')
		dialogPointerInfo.isDown = false
		dialogPointerInfo.isDownOnDialog = false
		dialogPointerInfo.openedDialog = null
	}
})

function isOnDialog(dialog, e) {
	if (!dialog) {
		return false
	}

	const dialogRect = dialog.getClientRects()
	const rightEdge = dialogRect[0].left + dialogRect[0].width
	const bottomEdge = dialogRect[0].top + dialogRect[0].height

	if (
		e.clientX < dialogRect[0].left ||
		e.clientX > rightEdge ||
		e.clientY < dialogRect[0].top ||
		e.clientY > bottomEdge
	) {
		return false
	} else {
		return true
	}
}