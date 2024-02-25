import gulp from "gulp"
import paths from "../config/paths.js"
import plugins from "../config/plugins.js"

import fs from "fs"
import fonter from "gulp-fonter"
import ttf2woff2 from "gulp-ttf2woff2"

export const otfToTtf = () => {
	return gulp.src(`${paths.src.fonts}*.otf`, {})
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'FONTS (otf to ttf)',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(fonter({
			formats: ['ttf'],
		}))
		.pipe(gulp.dest(paths.src.fonts))
}

export const ttfToWoff = () => {
	return gulp.src(`${paths.src.fonts}*.ttf`, {})
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'FONTS (ttf to woff)',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(fonter({
			formats: ['woff'],
		}))
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.fonts),
			gulp.dest(paths.dev.fonts)
		))
		.pipe(gulp.src(`${paths.src.fonts}*.ttf`))
		.pipe(ttf2woff2())
		.pipe(plugins.gulpIf(
			app.isProduction,
			gulp.dest(paths.build.fonts),
			gulp.dest(paths.dev.fonts)
		))
}

export const fontsStyle = () => {
	let fontsFile = `${paths.srcFolder}/scss/fonts/_fonts.scss`
	let fontsPath = app.isProduction ? paths.build.fonts : paths.dev.fonts
	fs.readdir(fontsPath, function (err, fontsFiles) {
		if (fontsFiles) {
			if (!fs.existsSync(fontsFiles)) {
				fs.writeFile(fontsFile, '', cb)
				let newFileOnly
				console.group('Processed fonts:')
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split('.')[0]
					if (newFileOnly !== fontFileName && fontFileName !== 'icons') {
						console.log(fontFileName)
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName
						switch (fontWeight.toLowerCase()) {
							case 'thin':
								fontWeight = 100
								break
							case 'extralight':
								fontWeight = 200
								break
							case 'light':
								fontWeight = 300
								break
							case 'medium':
								fontWeight = 500
								break
							case 'semibold':
								fontWeight = 600
								break
							case 'bold':
								fontWeight = 700
								break
							case 'extrabold':
							case 'heavy':
								fontWeight = 800
								break
							case 'black':
								fontWeight = 900
								break
							default:
								fontWeight = 400
								break
						}
						fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
				console.groupEnd()
			} else {
				console.log("Файл _fonts.scss уже существует. Для обновления файла нужно его удалить!");
			}
		}
	})
	return gulp.src(paths.srcFolder)
	function cb() { }
}