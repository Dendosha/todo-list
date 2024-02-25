class Tabs {
	#defaultOptions = {
		activation: 'auto', // auto | manual
		prevKey: 'ArrowLeft',
		nextKey: 'ArrowRight',
	}

	constructor(element, options) {
		this.element = element
		this.options = { ...this.#defaultOptions, ...options }

		this.#setup()
	}

	#setup() {
		this.tabPanelsWrapper = this.element.querySelector('[data-tabs="tabpanels"]')
		this.tabPanels = this.element.querySelectorAll('[data-tabs="tabpanels"]>div')

		this.tabPresentations = this.element.querySelectorAll('ul[data-tabs="tablist"]>li')
		this.tabs = this.element.querySelectorAll('ul[data-tabs="tablist"]>li>a')

		this.currentTab = this.tabs[0]
		this.currentTabpanel = this.tabPanels[0]

		this.#addAccessibility()

		this.clickHandler = this.clickHandler.bind(this)
		this.keydownHandler = this.keydownHandler.bind(this)

		this.element.addEventListener('click', this.clickHandler)
		this.element.addEventListener('keydown', this.keydownHandler)
	}

	#addAccessibility() {
		this.tabs.forEach((tab, index) => {
			tab.setAttribute('role', 'tab')
			this.tabPresentations[index].setAttribute('role', 'presentation')
			this.tabPanels[index].setAttribute('role', 'tabpanel')
			this.tabPanels[index].setAttribute('tabindex', '0')

			if (index === 0) {
				tab.setAttribute('tabindex', '0')
				tab.setAttribute('aria-selected', 'true')
			} else {
				tab.setAttribute('tabindex', '-1')
				tab.setAttribute('aria-selected', 'false')
				this.tabPanels[index].setAttribute('hidden', '')
			}
		})
	}

	clickHandler(e) {
		if (e.target.closest('[role="tab"]')) this.openTab(e.target)
	}

	keydownHandler(e) {
		const tab = e.target.closest('[role="tab"]')
		if (!tab) return

		const tabIndex = Array.from(this.tabs).findIndex(value => value === tab)

		switch (e.key) {
			case this.options.prevKey:
				e.preventDefault()
				if (this.tabPanels[tabIndex].previousElementSibling) {
					this.selectTab(this.tabPresentations[tabIndex].previousElementSibling.children[0])
				} else {
					this.selectTab(this.tabPresentations[this.tabPresentations.length - 1].children[0])
				}
				break

			case this.options.nextKey:
				e.preventDefault()
				if (this.tabPanels[tabIndex].nextElementSibling) {
					this.selectTab(this.tabPresentations[tabIndex].nextElementSibling.children[0])
				} else {
					this.selectTab(this.tabPresentations[0].children[0])
				}
				break

			case 'Home':
				e.preventDefault()
				this.selectTab(this.tabPresentations[0].children[0])
				break

			case 'End':
				e.preventDefault()
				this.selectTab(this.tabPresentations[this.tabPresentations.length - 1].children[0])
				break

			case 'Enter':
			case ' ':
				if (this.options.activation === 'manual') {
					e.preventDefault()
					this.openTab(e.target)
				}
				break

			case 'Tab':
				if (this.options.activation === 'manual') {
					if (tab.getAttribute('aria-selected') !== 'true') {
						e.preventDefault()
						this.currentTab.focus()
					}
				}
				break
		}
	}

	selectTab(newTab) {
		if (this.options.activation === 'auto') {
			this.openTab(newTab)
		} else {
			newTab.focus()
		}
	}

	openTab(newTab) {
		const newTabPanel = this.tabPanelsWrapper.querySelector(newTab.getAttribute('href'))

		this.currentTab.setAttribute('tabindex', '-1')
		this.currentTab.setAttribute('aria-selected', 'false')
		this.currentTabpanel.setAttribute('hidden', '')

		newTab.setAttribute('tabindex', '0')
		newTab.setAttribute('aria-selected', 'true')
		newTabPanel.removeAttribute('hidden')

		newTab.focus()

		this.currentTab = newTab
		this.currentTabpanel = newTabPanel
	}
}

export default Tabs