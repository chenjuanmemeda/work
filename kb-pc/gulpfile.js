var gulp = require('gulp');
var clean = require('gulp-clean');
//清除dist
gulp.task('clean', function () {
	return gulp.src(['dist'], {read: false})
	.pipe(clean());
});
