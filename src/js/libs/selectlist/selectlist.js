class SelectList {
	static #allSelectLists = new Map()
	#searchString = ''
	#searchTimeout
	#defaultOptions = {
		placeholder: 'Default placeholder',
		label: 'Custom selectlist',
		selectlistItems: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		visibleItemsCount: 4,
	}

	constructor(element, options) {
		this.element = element
		this.options = options

		if (!this.options.placeholder) this.options.placeholder = this.#defaultOptions.placeholder
		if (!this.options.label && !this.options.labelledby) this.options.label = this.#defaultOptions.label
		if (!this.options.selectlistItems?.filter(Boolean)?.length) this.options.selectlistItems = this.#defaultOptions.selectlistItems
		if (!this.options.visibleItemsCount) this.options.visibleItemsCount = this.#defaultOptions.visibleItemsCount

		const selectlistHTML = this.#render()

		SelectList.#allSelectLists.set(element, selectlistHTML)

		if (this.options.selectedItemIndex) this.select(`${this.options.listboxId}-${this.options.selectedItemIndex}`)

		this.#setup()
	}

	get isOpened() {
		return this.#html.combobox.getAttribute('aria-expanded') == 'true' ? true : false
	}

	get current() {
		const selectedItem = this.#html.listbox.querySelector('li[aria-selected="true"]')

		if (selectedItem) {
			return {
				selectedItem,
				value: selectedItem.innerText,
			}
		} else return
	}

	get #html() {
		return SelectList.#allSelectLists.get(this.element)
	}

	static get all() {
		const allInstances = []
		for (let value of this.#allSelectLists.values()) {
			allInstances.push(value.classInstance)
		}

		return allInstances
	}

	static find(searchParameter) {
		if (this.#allSelectLists.get(searchParameter)) return this.#allSelectLists.get(searchParameter).classInstance

		for (let key of this.#allSelectLists.keys()) {
			if (key?.id == searchParameter) return this.#allSelectLists.get(key).classInstance
		}
	}

	#render() {
		const input = document.createElement('input')
		input.type = 'text'
		input.ariaHidden = true
		input.tabIndex = -1
		input.classList.add('--visually-hidden')

		const combobox = document.createElement('div')
		combobox.innerText = this.options.placeholder
		combobox.tabIndex = 0
		combobox.role = 'combobox'
		if (this.options.label) combobox.setAttribute('aria-label', this.options.label)
		if (this.options.labelledby) combobox.setAttribute('aria-labelledby', this.options.labelledby)
		combobox.ariaHasPopup = 'listbox'
		combobox.ariaExpanded = false
		combobox.classList.add('--selectlist__combobox')

		const listboxWrapper = document.createElement('div')
		listboxWrapper.classList.add('--selectlist__listbox-wrapper')

		const listbox = document.createElement('ul')
		listbox.id = this.options?.listboxId
		listbox.role = 'listbox'
		listbox.classList.add('--selectlist__listbox')

		this.options.selectlistItems.forEach((item, index) => {
			const selectlistItem = document.createElement('li')
			selectlistItem.innerText = item
			selectlistItem.id = `${this.options.listboxId}-${index}`
			selectlistItem.role = 'option'
			selectlistItem.setAttribute('aria-selected', false)
			selectlistItem.classList.add('--selectlist__option')

			listbox.append(selectlistItem)
		})

		const elementAttributes = Array.from(this.element.attributes)
		elementAttributes.forEach(attribute => {
			if (attribute.name.startsWith('data-')) this.element.removeAttribute(attribute.name)
		})

		this.element.append(input)
		this.element.append(combobox)
		this.element.append(listboxWrapper)
		listboxWrapper.append(listbox)

		const visibleItemsCount = this.options.visibleItemsCount
		const firstItem = listbox.firstChild
		const itemHeight = firstItem.offsetHeight
		const listboxBlockBordersWidth = parseInt(getComputedStyle(listbox).borderTopWidth) + parseInt(getComputedStyle(listbox).borderBottomWidth)

		listbox.style.maxHeight = `${itemHeight * visibleItemsCount + listboxBlockBordersWidth}px`
		if (listbox.childElementCount <= visibleItemsCount) {
			listbox.style.overflowY = 'hidden'
		}

		return {
			classInstance: this,
			input,
			combobox,
			listboxWrapper,
			listbox
		}
	}

	#setup() {
		this.comboboxKeydownHandler = this.comboboxKeydownHandler.bind(this)
		this.comboboxKeypressHandler = this.comboboxKeypressHandler.bind(this)
		this.comboboxClickHandler = this.comboboxClickHandler.bind(this)
		this.comboboxBlurHandler = this.comboboxBlurHandler.bind(this)
		this.optionsClickHandler = this.optionsClickHandler.bind(this)

		this.#html.combobox.addEventListener('keydown', this.comboboxKeydownHandler)
		this.#html.combobox.addEventListener('keypress', this.comboboxKeypressHandler)
		this.#html.combobox.addEventListener('click', this.comboboxClickHandler)
		this.#html.combobox.addEventListener('blur', this.comboboxBlurHandler)
		this.#html.listboxWrapper.addEventListener('mousedown', this.optionsClickHandler)
	}

	comboboxClickHandler(e) {
		if (e.currentTarget.getAttribute('aria-expanded') == 'false') this.open()
		else this.close()
	}

	comboboxBlurHandler(e) {
		this.close()
	}

	comboboxKeydownHandler(e) {
		const selectedItem = this.current?.selectedItem

		switch (e.code) {
			case 'Enter':
			case 'Space':
				this.isOpened ? this.close() : this.open()
				break
			case 'ArrowDown':
				if (!this.isOpened) {
					this.open()
					if (!selectedItem) this.select(this.#html.listbox.firstChild.id)
					this.#html.listbox.scrollTop = 0
				}
				else if (!selectedItem) this.select(this.#html.listbox.firstChild.id)
				else if (selectedItem?.nextElementSibling) this.select(selectedItem.nextElementSibling.id)
				break
			case 'ArrowUp':
				if (!this.isOpened) {
					this.open()
					if (!selectedItem) this.select(this.#html.listbox.firstChild.id)
					this.#html.listbox.scrollTop = 0
				} else {
					if (e.altKey) this.close()
					else if (!selectedItem) this.select(this.#html.listbox.firstChild.id)
					else if (selectedItem?.previousElementSibling) this.select(selectedItem.previousElementSibling.id)
				}
				break
			case 'Home':
				if (!this.isOpened) this.open()
				this.select(this.#html.listbox.firstChild.id)
				this.#html.listbox.scrollTop = 0
				break
			case 'End':
				if (!this.isOpened) this.open()
				this.select(this.#html.listbox.lastChild.id)
				this.#html.listbox.scrollTop = this.#html.listbox.scrollHeight
				break
			case 'Escape':
				if (this.isOpened) this.close()
				break
		}
	}

	comboboxKeypressHandler(e) {
		if (this.#searchTimeout) clearTimeout(this.#searchTimeout)
		this.#searchTimeout = setTimeout(() => this.#searchString = '', 400)
		this.#searchString += e.key

		for (let listItem of this.#html.listbox.querySelectorAll('li[role="option"]')) {
			if (listItem.innerText.toLowerCase().startsWith(this.#searchString.toLowerCase())) {
				this.select(listItem.id)
				break
			}
		}
	}

	optionsClickHandler(e) {
		if (e.target.tagName !== 'LI') return

		this.select(e.target.id)
	}

	open() {
		this.#html.combobox.setAttribute('aria-expanded', true)
		this.#html.combobox.setAttribute('aria-controls', this.#html.listbox.id)

		const selectedItem = this.#html.listbox.querySelector('li[aria-selected="true"]')
		if (selectedItem) this.#html.combobox.setAttribute('aria-activedescendant', selectedItem.id)
	}

	close() {
		this.#html.combobox.setAttribute('aria-expanded', false)
		this.#html.combobox.removeAttribute('aria-controls')
		this.#html.combobox.removeAttribute('aria-activedescendant')
	}

	select(id) {
		const selectedItem = document.getElementById(id)
		if (!selectedItem) return

		this.#html.listbox.querySelector('li[aria-selected="true"]')?.setAttribute('aria-selected', false)
		selectedItem.setAttribute('aria-selected', true)

		this.#html.input.value = this.#html.combobox.innerText = selectedItem.innerText

		if (selectedItem.offsetTop + selectedItem.offsetHeight > this.#html.listbox.clientHeight + this.#html.listbox.scrollTop) {
			selectedItem.scrollIntoView({ block: 'end', behavior: "smooth" })
		} else if (selectedItem.offsetTop < this.#html.listbox.scrollTop) {
			selectedItem.scrollIntoView({ block: 'start', behavior: "smooth" })
		}
	}

	destroy() {
		this.#html.combobox.removeEventListener('keydown', this.comboboxKeydownHandler)
		this.#html.combobox.removeEventListener('keydown', this.comboboxKeypressHandler)
		this.#html.combobox.removeEventListener('click', this.comboboxClickHandler)
		this.#html.combobox.removeEventListener('blur', this.comboboxBlurHandler)
		this.#html.listboxWrapper.removeEventListener('mousedown', this.optionsClickHandler)

		this.element.remove()
	}
}

export default SelectList
