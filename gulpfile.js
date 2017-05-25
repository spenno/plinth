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


// Environment configuration (gulp --prod)
var config = {
    production: !!util.env.prod,
    development: !util.env.prod
};


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


// Copy jQuery to dist folder in production
gulp.task('copy', function() {
  return gulp.src(paths.jQuery)
    .pipe(gulp.dest(paths.dist));
});


// Browsersync
gulp.task('browsersync', ['js', 'sass'], function() {
  if (config.production) return; // Don't initiate in production
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


// Compile Sass
gulp.task('sass', ['scss-lint'], function () {
  return gulp.src(paths.sassMain)
    .pipe(config.development ? sourcemaps.init() : util.noop()) // Source maps in default task only
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('plinth.css'))
      .pipe(config.production ? minify() : util.noop()) // Minify in production
    .pipe(config.development ? sourcemaps.write() : util.noop()) // Source maps in default task only
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(config.development ? browsersync.stream() : util.noop()); // Inject CSS via Browsersync in default task only
});


// JavaScript task
gulp.task('js', ['jshint'], function() {
  return gulp.src(scripts)
    .pipe(config.development ? sourcemaps.init() : util.noop()) // Source maps in default task only
      .pipe(concat('plinth.js'))
      .pipe(config.production ? uglify() : util.noop()) // Uglify in production
    .pipe(config.development ? sourcemaps.write() : util.noop()) // Source maps in default task only
    .pipe(gulp.dest(paths.dist))
    .pipe(config.development ? browsersync.stream() : util.noop()); // Reload page via Browsersync in default task only
});


// Watch for Sass and JavaScript changes
gulp.task('watch', function () {
  if (config.production) return; // Don't watch in production
  gulp.watch(paths.sassPattern, ['sass']);
  gulp.watch(paths.jsMain, ['js']);
});


// Default task ('gulp')
gulp.task('default', ['browsersync', 'copy', 'sass', 'js', 'watch']);
