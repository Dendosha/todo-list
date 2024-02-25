class BurgerMenu {
	constructor(burgerButton, navigation, options) {
		this.burgerButton = burgerButton
		this.navigation = navigation
		this.options = options

		this.#setup()
	}

	#setup() {
		this.isExpanded = this.burgerButton.getAttribute('aria-expanded')

		this.openCallback = this.options.openCallback
		this.closeCallback = this.options.closeCallback
		this.setupCallback = this.options.setupCallback
		this.mediaCallback = this.options.mediaCallback

		this.clickHandler = this.clickHandler.bind(this)
		this.keydownHandler = this.keydownHandler.bind(this)
		this.mediaQueryHandler = this.mediaQueryHandler.bind(this)

		this.burgerButton.addEventListener('click', this.clickHandler)
		document.addEventListener('keydown', this.keydownHandler)

		if (this.options.closeMediaQuery) this.options.closeMediaQuery.addEventListener('change', this.mediaQueryHandler)

		if (this.setupCallback) this.setupCallback[0](this.setupCallback.slice(1))
	}

	clickHandler(e) {
		this.burgerButton.firstElementChild.style.animationPlayState = 'running'
		this.burgerButton.firstElementChild.style.animationDirection = 'normal'

		if (this.isExpanded === 'false') this.open()
		else this.close()
	}

	keydownHandler(e) {
		if (e.code === 'Escape' && this.burgerButton.getAttribute('aria-expanded') === 'true') this.close()
	}

	mediaQueryHandler(e) {
		if (this.options.closeMediaQuery.matches) {
			this.close()
			if (this.mediaCallback) this.mediaCallback[0](this.mediaCallback.slice(1))
		}
	}

	open() {
		this.isExpanded = 'true'

		this.burgerButton.setAttribute('aria-expanded', 'true')
		this.burgerButton.setAttribute('aria-controls', navigation?.id)

		this.navigation.classList.add('--open')
		document.body.classList.add('--burger-menu-opened')
		document.body.classList.add('--page-scrolled')

		if (this.openCallback) this.openCallback[0](...this.openCallback.slice(1))
	}

	close() {
		this.isExpanded = 'false'

		this.burgerButton.setAttribute('aria-expanded', 'false')
		this.burgerButton.removeAttribute('aria-controls')

		this.navigation.classList.remove('--open')
		document.body.classList.remove('--burger-menu-opened')
		document.body.classList.remove('--page-scrolled')

		if (this.closeCallback) this.closeCallback[0](...this.closeCallback.slice(1))

		this.burgerButton.focus()
	}
}

export default BurgerMenu