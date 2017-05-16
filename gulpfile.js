// Define Gulp and required plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');


// Environment configuration (gulp --prod)
var config = {
    production: !!util.env.prod,
    sourcemaps: !util.env.prod
};


// Paths to assets
var paths = {
    dist: 'dist/',
    jsMain: 'js/main.js',
    libs: 'libs/',
    sassMain: 'stylesheets/main.scss',
    sassPattern: 'stylesheets/**/*.scss'
};


// List of scripts to concat
var scripts = [
    paths.libs + 'magnific-popup/dist/jquery.magnific-popup.js',
    paths.libs + 'matchMedia/matchMedia.js',
    paths.libs + 'placeholdr/placeholdr.js',
    paths.jsMain
];


// Lint all Sass files
gulp.task('scss-lint', function() {
  return gulp.src(paths.sassPattern)
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});


// Compile Sass
gulp.task('sass', function () {
  return gulp.src(paths.sassMain)
    .pipe(config.sourcemaps ? sourcemaps.init() : util.noop()) // Source maps in default task only
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('plinth.css'))
      .pipe(config.production ? minify() : util.noop()) // Minify in production
    .pipe(config.sourcemaps ? sourcemaps.write() : util.noop()) // Source maps in default task only
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
});


// Lint the main JavaScript file
gulp.task('jshint', function() {
  return gulp.src(paths.jsMain)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// JavaScript task
gulp.task('js', function() {
  return gulp.src(scripts)
    .pipe(config.sourcemaps ? sourcemaps.init() : util.noop()) // Source maps in default task only
      .pipe(concat('plinth.js'))
      .pipe(config.production ? uglify() : util.noop()) // Uglify in production
    .pipe(config.sourcemaps ? sourcemaps.write() : util.noop()) // Source maps in default task only
    .pipe(gulp.dest(paths.dist));
});


// Watch for Sass and JavaScript changes
gulp.task('watch', function () {
  if (config.production) return; // Don't watch in production environment
  gulp.watch(paths.sassPattern, ['sass']);
  gulp.watch(paths.jsMain, ['js']);
});


// Default task ('gulp')
gulp.task('default', ['scss-lint', 'sass', 'jshint', 'js', 'watch']);
