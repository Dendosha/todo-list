import { slideTo } from "./functions.js"
import { disableScroll, enableScroll } from "../../scroll-lock/scrollLock.js"

export class Pagination {

	constructor(slider, slides, options) {
		this.slider = slider
		this.slides = slides
		this.options = options.pagination

		this.element = this.options.element

		if (this.element) this.#setup()
		else console.warn(('Pagination element is undefined'))
	}

	#setup() {
		this.userPointer = {
			isDown: false,
			target: null,
		}

		this.dots = Array.from(this.element.children)
		this.currentPage = this.dots[0]

		this.#addAccessibility()

		this.keyDownHandler = this.keyDownHandler.bind(this)
		this.pointerDownHandler = this.pointerDownHandler.bind(this)
		this.pointerUpHandler = this.pointerUpHandler.bind(this)

		this.element.addEventListener('keydown', this.keyDownHandler)
		this.element.addEventListener('pointerdown', this.pointerDownHandler)
		this.element.addEventListener('pointerup', this.pointerUpHandler)
	}

	#addAccessibility() {
		const buttonAriaLabel = this.options.a11y?.[1]?.split(', ') || ['Slide to', 'of']

		this.element.setAttribute('aria-label', this.options.a11y?.[0] || 'Slider pagination')

		this.dots.forEach((page, index) => {
			page.children[0].setAttribute('aria-label', `${buttonAriaLabel[0]} ${index + 1} ${buttonAriaLabel[1]} ${this.dots.length}`)

			if (index === 0) {
				page.children[0].setAttribute('aria-current', 'true')
			}
		})
	}

	keyDownHandler(e) {
		const page = e.target.parentElement
		if (page.tagName !== 'LI') return

		switch (e.key) {
			case 'Home':
				e.preventDefault()
				this.changeDot(this.dots[0])
				break
			case 'End':
				e.preventDefault()
				this.changeDot(this.dots[this.dots.length - 1])
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				this.changeDot(page)
				break
		}
	}

	pointerDownHandler(e) {
		if (e.target.closest('button')) {
			this.userPointer.isDown = true
			this.userPointer.target = e.target
		}
	}

	pointerUpHandler(e) {
		if (!this.userPointer.isDown) return

		if (e.target === this.userPointer.target) {
			this.changeDot(e.target.parentElement)
			this.userPointer.isDown = false
		}
	}

	update() {
		this.selectDot(this.dots[this.slider.slides.indexOf(this.slider.currentSlide)])
	}

	selectDot(page) {
		this.currentPage.children[0].removeAttribute('aria-current')
		page.children[0].setAttribute('aria-current', 'true')

		this.currentPage = page
	}

	changeDot(page) {
		this.selectDot(page)
		page.children[0].focus()
		slideTo(this.dots.indexOf(page), this.slider, this.slider.animation)
	}
}

export class Navigation {

	constructor(slider, slides, options) {
		this.slider = slider
		this.slides = slides
		this.options = options.navigation

		this.prevButton = this.options.prevButton
		this.nextButton = this.options.nextButton

		if (this.prevButton && this.nextButton) this.#setup()
		else console.warn(('Navigation buttons are undefined'))
	}

	#setup() {
		this.userPointer = {
			isDown: false,
			target: null,
		}

		this.#addAccessibility()

		this.keyDownHandler = this.keyDownHandler.bind(this)
		this.pointerDownHandler = this.pointerDownHandler.bind(this)
		this.pointerUpHandler = this.pointerUpHandler.bind(this)

		this.prevButton.addEventListener('keydown', this.keyDownHandler)
		this.prevButton.addEventListener('pointerdown', this.pointerDownHandler)
		this.prevButton.addEventListener('pointerup', this.pointerUpHandler)

		this.nextButton.addEventListener('keydown', this.keyDownHandler)
		this.nextButton.addEventListener('pointerdown', this.pointerDownHandler)
		this.nextButton.addEventListener('pointerup', this.pointerUpHandler)
	}

	#addAccessibility() {
		this.prevButton.setAttribute('aria-label', this.options.a11y?.[0] || 'Previous slide')
		this.nextButton.setAttribute('aria-label', this.options.a11y?.[1] || 'Next slide')
	}

	keyDownHandler(e) {
		const pressedButton = e.target.closest('button')

		if (!pressedButton) return

		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault()
			this.changeSlide(pressedButton)
		}
	}

	pointerDownHandler(e) {
		if (e.target.closest('button')) {
			this.userPointer.isDown = true
			this.userPointer.target = e.target.closest('button')
		}
	}

	pointerUpHandler(e) {
		if (!this.userPointer.isDown) return

		if (e.target.closest('button') === this.userPointer.target) {
			e.preventDefault()
			this.changeSlide(this.userPointer.target)

			this.userPointer.isDown = false
		}
	}

	changeSlide(button) {
		const currentSlideIndex = this.slider.currentSlideIndex

		switch (button) {
			case this.prevButton:
				if (this.slider.slides[currentSlideIndex].previousElementSibling) {
					slideTo(currentSlideIndex - 1, this.slider, this.slider.animation, true)
				} else {
					slideTo(this.slider.slides.length - 1, this.slider, this.slider.animation, true)
				}
				break
			case this.nextButton:
				if (this.slider.slides[currentSlideIndex].nextElementSibling) {
					slideTo(currentSlideIndex + 1, this.slider, this.slider.animation, true)
				} else {
					slideTo(0, this.slider, this.slider.animation, true)
				}
				break
		}
	}
}

export class StandardEffect {
	#previousTimeStamp = 0

	constructor(slider, slides, options) {
		this.slider = slider
		this.slides = slides
		this.options = options

		this.#setup()
	}

	#setup() {
		this.translateWidth = 0
		this.translateChange = 0
		this.translateValue = 0

		this.grabSlideList = {
			clientX: 0,
			clientY: 0,
			needChangeSlide: false,
			newSlideIndex: null,
			translated: 0,
		}

		this.pointerDownHandler = this.pointerDownHandler.bind(this)
		this.pointerUpHandler = this.pointerUpHandler.bind(this)
		this.pointerMoveHandler = this.pointerMoveHandler.bind(this)
		this.resizeObserver = this.resizeObserver.bind(this)

		this.slider.element.addEventListener('pointerdown', this.pointerDownHandler)
		this.slider.element.addEventListener('pointerup', this.pointerUpHandler)
		this.slider.element.addEventListener('pointermove', this.pointerMoveHandler, { passive: false })

		new ResizeObserver(this.resizeObserver).observe(this.slider.element)
	}

	resizeObserver() {
		this.translateWidth = this.slider.currentSlide.offsetWidth + this.slider.slidesGap

		if (getComputedStyle(this.slider.slideList).transform.split(', ')[4] % this.translateWidth !== 0) {
			this.slider.slideList.style.transform = `translateX(-${this.translateWidth * this.slider.currentSlideIndex}px)`
		}
	}

	pointerDownHandler(e) {
		if (e.target.closest('[data-slider="slideList"]') && e.isPrimary) {
			this.slider.userPointer.isDown = true
			this.slider.userPointer.target = e.target
			this.grabSlideList.clientX = e.clientX
			this.grabSlideList.clientY = e.clientY

			this.slider.slideList.style.transition = ''
			this.slider.slideList.style.cursor = this.slider.options.cursor.grab || 'default'

			disableScroll()
		}
	}

	pointerUpHandler(e) {
		if (this.slider.userPointer.isDown && e.isPrimary) {
			this.slider.userPointer.isDown = false
			this.slider.userPointer.target = null
			this.grabSlideList.clientX = 0
			this.grabSlideList.clientY = 0

			if (this.translateChange < 0 && Math.abs(this.translateChange) >= this.translateWidth / 2) {

				if (this.slider.currentSlideIndex !== this.slider.slides.length - 1) {
					slideTo(this.slider.currentSlideIndex + 1, this.slider, this.slideAnimation.bind(this), true)
				} else {
					this.grabSlideList.newSlideIndex = 0
					slideTo(0, this.slider, this.slideAnimation.bind(this), true)
				}

			} else if (this.translateChange > 0 && Math.abs(this.translateChange) >= this.translateWidth / 2) {

				if (this.slider.currentSlideIndex !== 0) {
					slideTo(this.slider.currentSlideIndex - 1, this.slider, this.slideAnimation.bind(this), true)
				} else {
					slideTo(this.slider.slides.length - 1, this.slider, this.slideAnimation.bind(this), true)
				}

			} else {
				this.slider.slideList.style.transform = `translateX(${this.grabSlideList.translated}px)`
			}

			this.slider.slideList.style.transition = this.slider.options.transition
			this.slider.slideList.style.cursor = this.slider.options.cursor.pointerEnter || 'default'

			enableScroll()
		}
	}

	pointerMoveHandler(e) {
		if (!this.slider.userPointer.isDown || !e.isPrimary) return
		e.preventDefault()
		e.stopPropagation()

		if (Date.now() - this.#previousTimeStamp < 1) return
		this.#previousTimeStamp = Date.now()

		this.grabSlideList.translated = -this.translateWidth * this.slider.currentSlideIndex
		this.translateChange = e.clientX - this.grabSlideList.clientX
		this.translateValue = this.grabSlideList.translated + this.translateChange

		this.slider.slideList.style.transform = `translateX(${this.translateValue}px)`
	}

	slideAnimation(slideIndex) {
		this.slider.slideList.style.transform = `translateX(-${this.translateWidth * slideIndex}px)`
	}
}