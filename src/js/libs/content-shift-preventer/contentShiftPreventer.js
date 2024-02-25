const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

function preventContentShift(isScrollbarVisible) {
	if (!isScrollbarVisible) document.documentElement.style.paddingRight = `${scrollbarWidth}px`
	else document.documentElement.style.paddingRight = 0
}

export default preventContentShift