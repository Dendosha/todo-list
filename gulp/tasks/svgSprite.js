import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import gulpSvgSprite from "gulp-svg-sprite"

const availableSpriteModes = [
	'--css',
	'--view',
	'--defs',
	'--symbol',
	'--stack',
]

const svgSprite = () => {
	return gulp.src(paths.src.svgSprite, {})
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'SVG Sprite',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(gulpSvgSprite(getSpriteSettings()))
		.pipe(gulp.dest(`${paths.srcFolder}/img`))
}

const getSpriteSettings = () => {
	let spriteSettings = {
		mode: {}
	}
	app.argv.forEach(arg => {
		if (availableSpriteModes.includes(arg)) {
			const spriteMode = arg.slice(2)
			spriteSettings.mode[spriteMode] = {
				dest: './icons',
				sprite: `sprite-${spriteMode}.svg`,
				example: app.spriteExample,
			}
		}
	})

	console.log('Settings:', spriteSettings)

	return spriteSettings
}

export default svgSprite
