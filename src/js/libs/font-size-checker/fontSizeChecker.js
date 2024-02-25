const createRootFontSizeChecker = () => {
	const rootFontSizeCheckElement = document.createElement('div')
	rootFontSizeCheckElement.innerText = 'Text to check root font size'
	rootFontSizeCheckElement.setAttribute('aria-hidden', 'true') = true

	rootFontSizeCheckElement.style.position = 'fixed'
	rootFontSizeCheckElement.style.zIndex = '-1'
	rootFontSizeCheckElement.style.visibility = 'hidden'
	rootFontSizeCheckElement.style.fontSize = '1rem'

	document.body.prepend(rootFontSizeCheckElement)

	return rootFontSizeCheckElement
}

export default createRootFontSizeChecker