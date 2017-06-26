// Require Gulp and plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync').create(),
    minify = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');


// Paths to assets
var paths = {
    dist: 'dist/',
    jQuery: 'node_modules/jquery/dist/jquery.min.js',
    jsMain: 'js/main.js',
    nodeModules: 'node_modules/',
    sassMain: 'stylesheets/main.scss',
    sassPattern: 'stylesheets/**/*.scss'
};


// List of scripts to concat
var scripts = [
    paths.nodeModules + 'match-media/matchMedia.js',
    paths.nodeModules + 'jquery-placeholder/jquery.placeholder.js',
    paths.jsMain
];


// Copy fallback jQuery to dist folder
gulp.task('copy', function() {
  return gulp.src(paths.jQuery)
    .pipe(gulp.dest(paths.dist));
});


// Browsersync
gulp.task('browsersync', ['js:dev', 'sass:dev'], function() {
  browsersync.init({
    server: {
      baseDir: './'
    }
  });
});


// Lint all Sass files
gulp.task('scss-lint', function() {
  return gulp.src(paths.sassPattern)
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});


// Lint the main JavaScript file
gulp.task('jshint', function() {
  return gulp.src(paths.jsMain)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// Compile Sass for development
gulp.task('sass:dev', ['scss-lint'], function () {
  return gulp.src(paths.sassMain)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('plinth.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());
});


// Compile Sass for production
gulp.task('sass:prod', ['scss-lint'], function () {
  return gulp.src(paths.sassMain)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('plinth.css'))
    .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
});


// Development JavaScript task
gulp.task('js:dev', ['jshint'], function() {
  return gulp.src(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('plinth.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});


// JavaScript task
gulp.task('js:prod', ['jshint'], function() {
  return gulp.src(scripts)
    .pipe(concat('plinth.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});


// Watch for Sass and JavaScript changes
gulp.task('watch', function () {
  gulp.watch(paths.sassPattern, ['sass:dev']);
  gulp.watch(paths.jsMain, ['js:dev']);
});


// Default development task ('gulp')
gulp.task('default', ['browsersync', 'copy', 'sass:dev', 'js:dev', 'watch']);


// Production task ('gulp prod')
gulp.task('prod', ['copy', 'sass:prod', 'js:prod']);
