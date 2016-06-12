'use strict';

//let connect = require('gulp-connect');
let gulp = require('gulp');
let connect = require('gulp-connect-php');
let jade = require('gulp-jade');
let livereload = require('gulp-livereload');
let uglify = require('gulp-uglify');
let sass = require('gulp-sass');

gulp.task('server', function() {
    connect.server({
    port: 8000,
    base: 'dist'
  });
});

gulp.task('compress', function() {
  gulp.src('./js/*.js')
    //.pipe(uglify({
    //  preserveComments: 'license'
    //}).on('error', console.error.bind(console)))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src('./jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());

  gulp.src('./jade/include/*.jade')
  .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('jade/*.jade', ['templates']);
  gulp.watch('jade/include/*.jade', ['templates']);
  gulp.watch('js/*.js', ['compress']);
  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

gulp.task('default', ['templates', 'sass', 'compress', 'server', 'watch']);