var gulp   = require('gulp'),
 	gutil  = require('gulp-util'),
	argv   = require('minimist')(process.argv),
	gulpif = require('gulp-if'),
	prompt = require('gulp-prompt'),
	rsync  = require('gulp-rsync');

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