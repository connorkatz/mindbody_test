'use strict';

// gulp require
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    del = require('del');

// concat scripts
gulp.task("concatScripts", function() {
    return gulp.src(['src/js/jquery.js', 'src/js/app.js'])
        .pipe(sourceMaps.init())
        .pipe(concat("appBundled.js"))
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest("src/js"));
});

// uglify scripts
gulp.task("uglifyScripts", ['concatScripts'], function() {
    return gulp.src('dist/appBundled.js')
        .pipe(uglify())
        .pipe(rename('appBundled.min.js'))
        .pipe(gulp.dest("src/js"));
});

// compile sass and create source maps
gulp.task("compileSass", function() {
    return gulp.src('src/app.scss')
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('src/css'));
});

// watch for changed files
gulp.task("watch", function() {
   gulp.watch('src/scss/**/*.scss', ['compileSass']);
    gulp.watch('src/js/app.js', ['concatScripts']);
});

// clean old files
gulp.task('clean', function() {
    del(['dist', 'src/css/app.css*', 'src/js/appBundled*.js*']);
});

// gulp build
gulp.task("build" ['uglifyScripts', 'compileSass'], function() {
    return gulp.src(['src/css/app.css', 'src/js/appBundled/js', 'index.html', 'src/img/**'], {base: './'})
        .pipe('dist');
});

// gulp default
gulp.task("default", ['clean'], function() {
    gulp.start('build');
});