import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import webpack from "webpack-stream"
import babel from "gulp-babel"

import webpackConfig from "../../webpack.config.js"

const js = () => {
	return gulp.src(paths.src.js, { sourcemaps: app.isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'JS',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(babel())
		.pipe(webpack(webpackConfig))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.js),
			gulp.dest(paths.dev.js)
		))
		.pipe(plugins.browserSync.stream())
}

export default js

