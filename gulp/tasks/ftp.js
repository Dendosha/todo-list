import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import configFTP from "../config/ftp.js"
import vinylFTP from "vinyl-ftp"
import util from 'gulp-util'

const ftp = () => {
	configFTP.log = util.log
	const ftpConnect = vinylFTP.create(configFTP)
	return gulp.src(`${paths.buildFolder}/**/*.*`, {})
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'FTP',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(ftpConnect.dest(`/${paths.ftp}/${paths.rootFolder}`))
}

export default ftp