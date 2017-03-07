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
	cleanCSS = require('gulp-clean-css');

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

gulp.task('javascript', function(cb) {
	pump([
		gulp.src('src/public/js/*.js'),
		uglify(),
		concat('main.min.js'),
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

gulp.task('build', ['javascript', 'css']);

