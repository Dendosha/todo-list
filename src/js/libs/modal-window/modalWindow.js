class ModalWindow {
	static #all = []

	#defaultOptions = {
		state: 'closed',
		closeButtonSelector: '[data-close-button]',
		openButtonSelector: null,
		openCallback: null,
		closeCallback: null,
	}

	#focusElements = [
		'a[href]',
		'area[href]',
		'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
		'select:not([disabled]):not([aria-hidden])',
		'textarea:not([disabled]):not([aria-hidden])',
		'button:not([disabled]):not([aria-hidden])',
		'iframe',
		'object',
		'embed',
		'[contenteditable]',
		'[tabindex]:not([tabindex^="-"])'
	]

	constructor(element, options) {
		this.element = element
		this.options = { ...this.#defaultOptions, ...options }
		this.modalOpeners = []

		ModalWindow.#all.push(this)

		this.#setup()
	}

	static get all() {
		return this.#all
	}

	addModalOpener(modalOpener) {
		this.modalOpeners.push(modalOpener)

		modalOpener.addEventListener('click', this.open.bind(this))
	}

	#setup() {
		this.prepareToClose = false
		this.lastFocusedOpener = null
		this.focusableElements = Array.from(this.element.querySelectorAll(this.#focusElements))

		this.clickHandler = this.clickHandler.bind(this)
		this.mouseDownHandler = this.mouseDownHandler.bind(this)
		this.mouseUpHandler = this.mouseUpHandler.bind(this)
		this.keydownHandler = this.keydownHandler.bind(this)

		this.element.addEventListener('click', this.clickHandler)
		this.element.addEventListener('mousedown', this.mouseDownHandler)
		this.element.addEventListener('mouseup', this.mouseUpHandler)
		this.element.addEventListener('keydown', this.keydownHandler)

		if (this.element.dataset?.state == 'opened') this.open()

		document.querySelectorAll(this.options.openButtonSelector)?.forEach(this.addModalOpener.bind(this))
	}

	clickHandler(e) {
		if (e.target.closest(this.options.closeButtonSelector)) this.close()
	}

	mouseDownHandler(e) {
		if (!e.target.closest('[role="dialog"]')) this.prepareToClose = true
	}

	mouseUpHandler(e) {
		if (this.prepareToClose && !e.target.closest('[role="dialog"]')) {
			this.close()
		}
		this.prepareToClose = false
	}

	keydownHandler(e) {
		if (e.code == 'Escape') this.close()

		if (e.code === 'Tab') {
			const focusedElementIndex = this.focusableElements.indexOf(document.activeElement)

			if (e.shiftKey && focusedElementIndex === 0) {
				this.focusableElements[this.focusableElements.length - 1].focus()
				e.preventDefault()
			}

			if (!e.shiftKey && focusedElementIndex === this.focusableElements.length - 1) {
				this.focusableElements[0].focus()
				e.preventDefault()
			}
		}
	}

	open() {
		document.body.classList.add('--modal-opened')

		this.lastFocusedOpener = document.activeElement

		this.element.dataset.state = this.options.state = 'opened'
		this.element.setAttribute('aria-hidden', false)
		this.element.querySelectorAll(this.#focusElements)[0].focus()

		if (this.options.openCallback) {
			this.options.openCallback[0](...this.options.openCallback.slice(1))
		}
	}

	close() {
		document.body.classList.remove('--modal-opened')

		this.element.dataset.state = this.options.state = 'closed'
		this.element.setAttribute('aria-hidden', true)
		this.lastFocusedOpener?.focus()

		if (this.options.closeCallback) {
			this.options.closeCallback[0](...this.options.closeCallback.slice(1))
		}
	}
}

export default ModalWindow