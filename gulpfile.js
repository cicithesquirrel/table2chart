/* jshint node: true */
"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

var paths = {
    scripts: ['src/*.js'],
    build: 'table2chart.min.js',
    builddir: 'public/build',
    tests: ['test/*.js']
};

gulp.task('clean', function (endCallback) {
    del(['public']);
    endCallback();
});

gulp.task('scripts', ['clean'], function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(paths.build))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.builddir));
});

gulp.task('mocha', function () {
    return gulp.src(paths.tests).pipe(mocha());
});

gulp.task('pre-test', function () {
    return gulp.src(paths.scripts)
        .pipe(istanbul({
            'hook-run-in-context': true,
            //'include-all-sources': true,
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            reporters: ['text', 'html'],
            reportOpts: {
                dir: 'public/coverage'
            }
        }));
});

gulp.task('default', ['clean', 'scripts', 'test']);
