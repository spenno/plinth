'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sasslint = require('gulp-sass-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

sass.compiler = require('node-sass');



// -----------------------------------------------------------------------------
// Paths
// -----------------------------------------------------------------------------

var paths = {
    dist: 'dist/',
    jsMain: 'js/main.js',
    nodeModules: 'node_modules/',
    sassMain: 'stylesheets/main.scss',
    sassPattern: 'stylesheets/**/*.scss'
};



// -----------------------------------------------------------------------------
// Scripts to concat
// -----------------------------------------------------------------------------

var scripts = [
    paths.nodeModules + 'match-media/matchMedia.js',
    paths.jsMain
];



// -----------------------------------------------------------------------------
// Sass Lint
// -----------------------------------------------------------------------------

gulp.task('sasslint', function() {
  return gulp.src(paths.sassPattern)
    .pipe(sasslint({
      options: {
        configFile: '.sass-lint.yml'
      }
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
});



// -----------------------------------------------------------------------------
// JSHint
// -----------------------------------------------------------------------------

gulp.task('jshint', function() {
  return gulp.src(paths.jsMain)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});



// -----------------------------------------------------------------------------
// Sass (development)
// -----------------------------------------------------------------------------

gulp.task('sass:dev', ['sasslint'], function () {
  return gulp.src(paths.sassMain)
    .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat('plinth.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist));
});



// -----------------------------------------------------------------------------
// Sass (production)
// -----------------------------------------------------------------------------

gulp.task('sass:prod', ['sasslint'], function () {
  return gulp.src(paths.sassMain)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('plinth.css'))
    .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
});



// -----------------------------------------------------------------------------
// JavaScript (development)
// -----------------------------------------------------------------------------

gulp.task('js:dev', ['jshint'], function() {
  return gulp.src(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('plinth.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});



// -----------------------------------------------------------------------------
// JavaScript (production)
// -----------------------------------------------------------------------------

gulp.task('js:prod', ['jshint'], function() {
  return gulp.src(scripts)
    .pipe(concat('plinth.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});



// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

gulp.task('watch', function () {
  gulp.watch(paths.sassPattern, ['sass:dev']);
  gulp.watch(paths.jsMain, ['js:dev']);
});



// -----------------------------------------------------------------------------
// Default task (development)
// -----------------------------------------------------------------------------

gulp.task('default', ['sass:dev', 'js:dev', 'watch']);



// -----------------------------------------------------------------------------
// Production task
// -----------------------------------------------------------------------------

gulp.task('prod', ['sass:prod', 'js:prod']);
