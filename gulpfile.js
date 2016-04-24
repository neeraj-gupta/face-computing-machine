/**
 * Created by Neeraj on 4/14/2016.
 * File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

// create a default task and just log a message
gulp.task('default', ['jshint','build-css','scripts','watch']);

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src('source/javascript/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('public/javascripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('javascript/**/*.js', ['jshint', 'scripts']);
    gulp.watch('public/scss/*.scss', ['build-css']);
});