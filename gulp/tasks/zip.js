import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import { deleteAsync } from "del";
import gulpZip from "gulp-zip";

const zip = () => {
	deleteAsync(`./${paths.rootFolder}.zip`)
	return gulp.src(`${paths.buildFolder}/**/*.*`, {})
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'ZIP',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(gulpZip(`${paths.rootFolder}.zip`))
		.pipe(gulp.dest('./'))
}

export default zip