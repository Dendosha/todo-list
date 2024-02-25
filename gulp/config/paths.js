import * as nodePath from "path"
const rootFolder = nodePath.basename(nodePath.resolve())

const devFolder = './build'
const buildFolder = './docs'
const srcFolder = './src'

const paths = {
	dev: {
		files: `${devFolder}/files/`,
		html: `${devFolder}/`,
		css: `${devFolder}/css/`,
		js: `${devFolder}/js/`,
		php: `${devFolder}/php/`,
		img: `${devFolder}/img/`,
		fonts: `${devFolder}/fonts/`,
	},
	build: {
		files: `${buildFolder}/files/`,
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		php: `${buildFolder}/php/`,
		img: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
	},
	src: {
		files: `${srcFolder}/files/**/*.*`,
		html: `${srcFolder}/html/*.html`,
		scss: `${srcFolder}/scss/main.scss`,
		js: `${srcFolder}/js/*.js`,
		php: `${srcFolder}/php/**/*.*`,
		img: `${srcFolder}/img/**/*.*`,
		svgSprite: `${srcFolder}/svg-sprite/*.svg`,
		fonts: `${srcFolder}/fonts/`,
	},
	watch: {
		files: `${srcFolder}/files/**/*.*`,
		html: `${srcFolder}/html/**/*.html`,
		scss: `${srcFolder}/scss/**/*.scss`,
		js: `${srcFolder}/js/**/*.js`,
		php: `${srcFolder}/php/**/*.*`,
		img: `${srcFolder}/img/**/*.*`,
	},
	clean: [buildFolder, devFolder],
	devFolder,
	buildFolder,
	srcFolder,
	rootFolder,
	ftp: 'localhost',
}

export default paths