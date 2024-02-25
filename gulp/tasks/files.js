import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

const files = () => {
	return gulp.src(paths.src.files)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'FILES',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.files),
			gulp.dest(paths.dev.files)
		))
		.pipe(plugins.browserSync.stream())
}

export default files