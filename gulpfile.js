/* jshint node: true */
"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');

var paths = {
    scripts: ['src/*.js'],
    build: 'table2chart.min.js',
    builddir: 'public'
};

gulp.task('clean', function (endCallback) {
    del([paths.builddir]);
    endCallback();
});

gulp.task('scripts', ['clean'], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(paths.build))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.builddir + '/build'));
});

gulp.task('default', ['clean', 'scripts']);
