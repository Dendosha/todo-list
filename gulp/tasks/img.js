import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import webp from "gulp-webp"
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin"

const img = () => {
	return gulp.src(paths.src.img)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'IMG',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			plugins.newer(paths.build.img),
			plugins.newer(paths.dev.img)
		))
		.pipe(webp())
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.img),
			gulp.dest(paths.dev.img)
		))
		.pipe(gulp.src(paths.src.img))
		.pipe(plugins.gulpIf(
			app.isProduction,
			plugins.newer(paths.build.img),
			plugins.newer(paths.dev.img)
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			imagemin(
				[
					gifsicle({ interlaced: true }),
					mozjpeg({ quality: 85, progressive: true }),
					optipng({ optimizationLevel: 5 }),
					svgo({
						plugins: [
							{
								name: 'removeViewBox',
								active: false,
							},
							{
								name: 'cleanupIDs',
								active: false,
							},
						],
					}),
				],
			)
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.img),
			gulp.dest(paths.dev.img)
		))
		.pipe(plugins.browserSync.stream())
}

export default img
