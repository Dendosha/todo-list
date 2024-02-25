import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

const server = (done) => {
	plugins.browserSync.init({
		// server: {
		// 	baseDir: `${paths.build.html}`,
		// },
		notify: false,
		proxy: paths.rootFolder.toLowerCase(),
	})
}

export default server