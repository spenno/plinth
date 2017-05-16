// Define required Gulp plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');


// Configuration
var config = {
    production: !!util.env.prod,
    sourcemaps: !util.env.prod
};


// Lint all Sass files
gulp.task('scss-lint', function() {
  return gulp.src('stylesheets/**/*.scss')
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});


// Compile Sass
gulp.task('sass', function () {
  return gulp.src('stylesheets/main.scss')
    .pipe(gulpif(config.sourcemaps, sourcemaps.init())) // Initialise source maps in default task only
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('main.css'))
      .pipe(config.production ? minify() : util.noop()) // Uglify in production task only
    .pipe(gulpif(config.sourcemaps, sourcemaps.write())) // Write source maps in default task only
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/'))
});


// Lint the main JavaScript file
gulp.task('jshint', function() {
  return gulp.src('js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// JavaScript task
gulp.task('js', function() {
  return gulp.src(['libs/magnific-popup/dist/jquery.magnific-popup.js', 'js/main.js'])
    .pipe(gulpif(config.sourcemaps, sourcemaps.init())) // Initialise source maps in default task only
      .pipe(concat('main.js'))
      .pipe(config.production ? uglify() : util.noop()) // Uglify in production task only
    .pipe(gulpif(config.sourcemaps, sourcemaps.write())) // Write source maps in default task only
    .pipe(gulp.dest('dist/'));
});


// Watch for Sass and JavaScript changes
gulp.task('watch', function () {
  if (config.production) return; // Don't watch in production task
  gulp.watch('stylesheets/**/*.scss', ['sass']);
  gulp.watch('js/main.js', ['js']);
});


// Default task ('gulp')
gulp.task('default', ['scss-lint', 'sass', 'jshint', 'js', 'watch']);
