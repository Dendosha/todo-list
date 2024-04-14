const dialog = document.getElementById('info-dialog')
const openDialogButton = document.getElementById('info-dialog-open')
const closeDialogButton = document.getElementById('info-dialog-close')

openDialogButton.addEventListener('click', (e) => {
	dialog.showModal()
	dialog.classList.add('--opening')
})

closeDialogButton.addEventListener('click', (e) => {
	dialog.classList.add('--closing')
})

document.documentElement.addEventListener('mouseup', (e) => {
	if (!dialog.hasAttribute('open')) return

	const dialogRect = dialog.getClientRects()
	const rightEdge = dialogRect[0].left + dialogRect[0].width
	const bottomEdge = dialogRect[0].top + dialogRect[0].height

	if (
		e.clientX < dialogRect[0].left ||
		e.clientX > rightEdge ||
		e.clientY < dialogRect[0].top ||
		e.clientY > bottomEdge
	) {
		dialog.classList.add('--closing')
	}
})

dialog.addEventListener('animationend', (e) => {
	if (dialog.classList.contains('--opening')) {
		dialog.classList.remove('--opening')
	} else if (dialog.classList.contains('--closing')) {
		dialog.close()
		dialog.classList.remove('--closing')
	}
})