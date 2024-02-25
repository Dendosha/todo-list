import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

const php = () => {
	return gulp.src(paths.src.php, { sourcemaps: app.isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'PHP',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.php),
			gulp.dest(paths.dev.php)
		))
		.pipe(plugins.browserSync.stream())
}

export default php