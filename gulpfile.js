'use strict';

var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var prefix = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var handlebars = require('browserify-handlebars');

gulp.task('server', function() {
    //JavaScript
    gulp.watch('src/js/**/*.*', ['check-js', 'pub-js']);

    //CSS
    gulp.watch('src/sass/**/*.scss', ['pub-css']);

    //HTML
    gulp.watch('src/index.html', ['pub-html']);

    gulp.src('public')
        .pipe(server({
            livereload: true,
        }));
});

gulp.task('pub-html', function() {
    gulp.src('./src/index.html').pipe(gulp.dest('./public'));
});

//Publish CSS
gulp.task('pub-css', function() {
    return gulp.src(['src/sass/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'))
        .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin({
            expand: true,
            keepSpecialComments: 0,
            noAdvanced: true
        }))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('pub-js', function() {
    var b = browserify();
    b.transform(handlebars);
    b.add('src/js/app.js');
    var bundleStream = b.bundle().on('error', function(err) {
        console.log(err.message);
        this.emit('end');
    });
    bundleStream
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(buffer())

    .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('check-js', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default', {
            verbose: true
        }));
});

