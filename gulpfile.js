var gulp   = require('gulp'),
 	gutil  = require('gulp-util'),
	argv   = require('minimist')(process.argv),
	gulpif = require('gulp-if'),
	prompt = require('gulp-prompt'),
	rsync  = require('gulp-rsync'),
	pump   = require('pump'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	del = require('del'),
	sourcemaps = require('gulp-sourcemaps');

// Default =====================================================================
gulp.task('default', ['watch']);

// Watch =======================================================================
gulp.task('watch', function() {
	gulp.watch('src/**/*', ['build']);
});

// Build =======================================================================
// tasks that will be included in build
gulp.task('javascript', function(cb) {
	pump([
		gulp.src('src/public/js/*.js'),
		sourcemaps.init(),
		uglify(),
		concat('bundle.min.js'),
		sourcemaps.write('map'),
		gulp.dest('build/public/js/')
	],
	cb
	);
});

gulp.task('css', function(cb) {
	pump([
		gulp.src('src/public/css/*.css'),
		cleanCSS(),
		concat('style.min.css'),
		gulp.dest('build/public/css/')
	],
	cb
	);
});

gulp.task('html', function(cb) {
	pump([
		gulp.src('src/resources/templates/*.html'),
		htmlmin({collapseWhitespace: true}),
		rename({suffix: '.min'}),
		gulp.dest('build/resources/templates/')
	],
	cb
	);
});

gulp.task('cleanData', function() {
	return del([
		'build/data/**/*'
	]);
});

var files = [
	'src/public/img/**',
	'src/modules/**/**',
	'src/resources/config.php',
	'src/index.php',
	'src/data/**/**'
];

gulp.task('move', ['cleanData'], function() {
	return gulp.src(files, {base: 'src/'})
		.pipe(gulp.dest('build/'));
});

gulp.task('build', ['javascript', 'css', 'html', 'cleanData', 'move']);


// Deploy ======================================================================
gulp.task('deploy', function() {

		conf = {
		progress: true,
		incremental: true,
		recursive: true,
		emptyDirectories: true,
		root: 'src',
		hostname: 'culibraries01.colorado.edu',
		username: 'vanvoors',
		destination: '/data/web/htdocs/culibraries/etd',
	};

	return gulp.src('src/')
		.pipe(rsync(conf));
});

function throwError(taskName, msg) {
  throw new gutil.PluginError({
      plugin: taskName,
      message: msg
    });
}
