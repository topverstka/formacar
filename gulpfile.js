let preprocessor = 'scss',
	fileswatch = 'html,htm,txt,json,md,woff2',
	baseDir = 'app',
	online = true;

let paths = {

	scripts: {
		src: [
			baseDir + '/js/app.js'
		],
		dest: baseDir + '/js',
	},

	styles: {
		src: baseDir + '/' + preprocessor + '/style.*',
		dest: baseDir + '/css',
	},

	deploy: {
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		include: [/* '*.htaccess' */], // Included files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'],
	},

	cssOutputName: 'style.css',
	jsOutputName: 'app.min.js',

}

const { src, dest, parallel, series, watch } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const newer = require('gulp-newer');
const rsync = require('gulp-rsync');
const del = require('del');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		//proxy: "startr",
		notify: false,
		online: online
	})
}

function scripts() {
	return src(paths.scripts.src)
		.pipe(concat(paths.jsOutputName))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}

function styles() {
	return src(paths.styles.src)
		.pipe(eval(preprocessor)())
		.pipe(concat(paths.cssOutputName))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function deploy() {
	return src(baseDir + '/')
		.pipe(rsync({
			root: baseDir + '/',
			hostname: paths.deploy.hostname,
			destination: paths.deploy.destination,
			include: paths.deploy.include,
			exclude: paths.deploy.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(baseDir + '/**/' + preprocessor + '/**/*', styles);
	watch(baseDir + '/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
	watch([baseDir + '/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.assets = series(styles, scripts);
exports.styles = styles;
exports.scripts = scripts;
exports.deploy = deploy;
exports.default = parallel(styles, scripts, browsersync, startwatch);
