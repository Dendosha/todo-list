import gulp from "gulp"
import paths from "./gulp/config/paths.js"

import reset from "./gulp/tasks/reset.js"
import server from "./gulp/tasks/server.js"

import files from "./gulp/tasks/files.js"
import html from "./gulp/tasks/html.js"
import scss from "./gulp/tasks/scss.js"
import js from "./gulp/tasks/js.js"
import php from "./gulp/tasks/php.js"

import img from "./gulp/tasks/img.js"
import svgSprite from "./gulp/tasks/svgSprite.js"

import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js"

import zip from "./gulp/tasks/zip.js"
import ftp from "./gulp/tasks/ftp.js"

global.app = {
	argv: process.argv,
	isProduction: process.argv.includes('--prod'),
	isDev: !process.argv.includes('--prod'),
	spriteExample: process.argv.includes('--example'),
}

function watcher() {
	gulp.watch(paths.watch.files, files)
	gulp.watch(paths.watch.html, html)
	gulp.watch(paths.watch.scss, scss)
	gulp.watch(paths.watch.js, js)
	gulp.watch(paths.watch.php, php)
	gulp.watch(paths.watch.img, img)
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)
const mainTasks = gulp.series(fonts, gulp.parallel(files, html, scss, js, php, img))
const updateFiles = gulp.series(reset, mainTasks)

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const prod = gulp.series(reset, mainTasks)
const deployZIP = gulp.series(reset, mainTasks, zip)
const deployFTP = gulp.series(reset, mainTasks, ftp)

gulp.task('default', dev)

export { dev }
export { prod }
export { deployZIP }
export { deployFTP }

export { fonts }
export { updateFiles }
export { svgSprite }