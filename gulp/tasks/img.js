import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import webp from "gulp-webp"
import imagemin from "gulp-imagemin"

const img = () => {
	return gulp.src(paths.src.img)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'IMG',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(plugins.newer(paths.build.img))
		.pipe(webp())
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.img),
			gulp.dest(paths.dev.img)
		))
		.pipe(gulp.src(paths.src.img))
		.pipe(plugins.newer(paths.build.img))
		.pipe(plugins.gulpIf(
			app.isProduction,
			imagemin({
				progressive: true,
				svgPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3,
			})
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.img),
			gulp.dest(paths.dev.img)
		))
		.pipe(plugins.browserSync.stream())
}

export default img
