import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import fileinclude from "gulp-file-include"
import webpHTML from "gulp-webp-retina-html"
import versionNumber from "gulp-version-number"

const html = () => {
	return gulp.src(paths.src.html)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'HTML',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(fileinclude())
		.pipe(plugins.replace(/@img\//g, 'img/'))
		.pipe(webpHTML({
			extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
			retina: {
				1: '',
				2: '@2x',
			},
		}))
		.pipe(plugins.gulpIf(
			app.isProduction,
			versionNumber({
				'value': '%DT%',
				'append': {
					'key': '_v',
					'cover': '0',
					'to': [
						'css',
						'js',
					]
				},
				'output': {
					'file': 'gulp/version.json'
				}
			}
			)
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.html),
			gulp.dest(paths.dev.html)
		))
		.pipe(plugins.browserSync.stream())
}

export default html