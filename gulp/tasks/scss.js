import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import dartSass from "sass"
import gulpSass from "gulp-sass"
import bulkSass from "gulp-sass-bulk-importer"
import rename from "gulp-rename"

import cleanCss from "gulp-clean-css"
import autoPrefixer from "gulp-autoprefixer"
import groupCssMediaQueries from "gulp-group-css-media-queries"

const sass = gulpSass(dartSass)

const scss = () => {
	return gulp.src(paths.src.scss, { sourcemaps: app.isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'SCSS',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(bulkSass())
		.pipe(sass({
			outputStyle: 'expanded',
		}))
		.pipe(plugins.replace(/@img\//g, '../img/'))
		.pipe(plugins.gulpIf(
			app.isProduction,
			groupCssMediaQueries()
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			autoPrefixer()
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.css),
			gulp.dest(paths.dev.css)
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			cleanCss()
		))
		.pipe(rename({
			extname: '.min.css',
		}))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.css),
			gulp.dest(paths.dev.css)
		))
		.pipe(plugins.browserSync.stream())
}

export default scss