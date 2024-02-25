/**
 * Switches the slide
 * 
 * @param {number} slideIndex Index of new slide
 * @param {Slider} slider Slider instance
 * @param {function} animation Slide switch animation function
 * @param {boolean} needUpdate Necessity of update interactive elements
 */

export function slideTo(slideIndex, slider, animation = null, needUpdate = false) {
	const statusTextTemplate = slider.options.slideStatusA11y?.split(', ') || ['Displaying slide', 'of']

	slider.currentSlide?.setAttribute('aria-hidden', 'true')
	slider.slides[slideIndex].removeAttribute('aria-hidden')

	slider.status.innerText = `${statusTextTemplate[0]} ${slideIndex + 1} ${statusTextTemplate[1]} ${slider.slides.length}`

	animation(slideIndex)

	slider.currentSlide = slider.slides[slideIndex]
	slider.currentSlideIndex = slideIndex

	if (needUpdate) slider.update()
}