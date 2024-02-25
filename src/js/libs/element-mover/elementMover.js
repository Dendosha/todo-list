// Root font size checker
import createFontSizeCheker from './fontSizeChecker.js'

class ElementMover {
	#previousTimeStamp = 0

	#defaultOptions = {
		queryType: 'max-width',
		position: -1,
		newParentCallback: null,
		oldParentCallback: null,
	}

	constructor(element, oldParent, newParent, options) {
		this.element = element
		this.oldParent = oldParent
		this.newParent = newParent

		this.options = { ...this.#defaultOptions, ...options }

		this.#setup()
	}

	#setup() {
		this.mediaQuery = matchMedia(`(${this.options.queryType}: ${this.options.querySize / 16}em)`)

		this.mediaQueryHandler = this.mediaQueryHandler.bind(this)

		document.addEventListener('DOMContentLoaded', this.mediaQueryHandler)
		this.mediaQuery.addEventListener('change', this.mediaQueryHandler)

		const rootFontSizeCheckElement = createFontSizeCheker()
		new ResizeObserver(this.mediaQueryHandler).observe(rootFontSizeCheckElement)
	}

	mediaQueryHandler(e) {
		if (Date.now() - this.#previousTimeStamp < 10) return
		this.#previousTimeStamp = Date.now()

		if (this.mediaQuery.matches) {
			this.placeElement()

			if (this.options.newParentCallback) this.options.newParentCallback[0](...this.options.newParentCallback.slice(1))
		}
		else {
			this.oldParent.append(this.element)

			if (this.options.oldParentCallback) this.options.oldParentCallback[0](...this.options.oldParentCallback.slice(1))
		}
	}

	placeElement() {
		if (this.newParent.contains(this.element)) return

		switch (parseInt(this.options.position)) {
			case 1:
				this.newParent.prepend(this.element)
				break
			case -1:
				this.newParent.append(this.element)
				break
			default:
				if (parseInt(this.options.position) > 0) {
					if (parseInt(this.options.position) > this.newParent.children.length) this.newParent.append(this.element)
					else this.newParent.children[parseInt(this.options.position) - 1].before(this.element)
				}
				else {
					if (Math.abs(parseInt(this.options.position)) > this.newParent.children.length) this.newParent.prepend(this.element)
					else this.newParent.children[this.newParent.children.length + parseInt(this.options.position)].after(this.element)
				}
				break
		}
	}
}

export default ElementMover