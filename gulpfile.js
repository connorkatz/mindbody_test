'use strict';

// =======================
// gulp require
// =======================
var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglifyJs = require('gulp-uglify'),
    uglifyCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    rename = require('gulp-rename');


// =======================
// compile sass
// =======================
gulp.task("compileSass", function() {
    return gulp.src('src/scss/app.scss')
        .pipe(maps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('src/css'));
});


// =======================
// watch sass
// =======================
gulp.task("watch", function() {
    gulp.watch('src/scss/**/*.scss', ['compileSass']);
});


// =======================
// combine, minify sass & js for /dist
// =======================
gulp.task("useref", ['compileSass'], function() {
    return gulp.src(['src/*.html'])
        .pipe(useref())
        .pipe(gulpif('*.js', uglifyJs()))
        .pipe(gulpif('*.css', uglifyCSS()))
        .pipe(gulp.dest('dist'));
});


// =======================
// clean compiled sass & /dist
// =======================
gulp.task("clean", function() {
    del(['dist', 'src/css']);
});


// ===============================
// move img/
// ===============================
gulp.task("moveImg", function() {
    return gulp.src('src/img/**')
        .pipe(rename({dirname: 'img'}))
        .pipe(gulp.dest('dist'));
});


// ===============================
// move fonts/
// ===============================
gulp.task("moveFonts", function() {
    return gulp.src('src/fonts/**')
        .pipe(rename({dirname: 'fonts'}))
        .pipe(gulp.dest('dist'));
});


// =======================
// default - clean & build
// =======================
gulp.task("default", ['clean','useref', 'moveImg', 'moveFonts']);