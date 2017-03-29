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
	'src/data/**/**',
	'src/prepbatch.php'
];

gulp.task('move', ['cleanData'], function() {
	return gulp.src(files, {base: 'src/'})
		.pipe(gulp.dest('build/'));
});

gulp.task('build', ['javascript', 'css', 'html', 'cleanData', 'move']);


// Deploy ======================================================================
gulp.task('deploy', function(cb) {

	var paths = ['build/modules', 'build/public', 'build/resources', 'build/index.php', 'build/prepbatch.php', 'build/data'];

	var conf = {
		progress: true,
		incremental: true,
		relative: true,
		emptyDirectories: true,
		recursive: true,
		clean: true,
		root: 'build',
	};

	if (argv.staging) {
		conf.hostname = 'culibraries03.colorado.edu';
		conf.username = 'vanvoors';
		conf.destination = '/data/web/htdocs/culibraries/etd';
	} else if (argv.production) {
		conf.hostname = 'culibraries01.colorado.edu';
		conf.username = 'vanvoors';
		conf.destination = '/data/web/htdocs/culibraries/etd';
	} else {
		throwError('deploy', gutil.colors.red('Missing or Invalid Target'));
	}

	pump([
		gulp.src(paths),
		gulpif(argv.production, prompt.confirm({
			message: 'Are you sure you want to push to PRODUCTION????',
			default: false
		})),
		rsync(conf)
	],
	cb
	);

});

function throwError(taskName, msg) {
  throw new gutil.PluginError({
      plugin: taskName,
      message: msg
    });
}
