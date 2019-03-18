'use strict';

// Load plugins
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const minify = require('gulp-clean-css');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');


// Load package file
const pkg = require('./package.json');


// Paths
const paths = {
  dist: 'dist/',
  jsMain: 'js/main.js',
  nodeModules: 'node_modules/',
  sassMain: 'stylesheets/main.scss',
  sassPattern: 'stylesheets/**/*.scss'
};


// Scripts to concat
const scripts = [
  // paths.nodeModules + 'folder/file.js',
  paths.jsMain
];


// Specify Node Sass as the Sass compiler
sass.compiler = require('node-sass');


// Sass linting with stylehint
function sassLint() {
  return gulp
    .src(paths.sassPattern)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
}


// JavaScript linting with JSHint
function jsLint() {
  return gulp
    .src(paths.jsMain)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}


// Compile Sass for development
function sassDev() {
  return gulp
    .src(paths.sassMain)
    .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist));
}


// Compile Sass for production
function sassProd() {
  return gulp
    .src(paths.sassMain)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
      .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist));
}


// Compile JavaScript for development
function jsDev() {
  return gulp
    .src(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat(pkg.name + '.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
}


// Compile JavaScript for production
function jsProd() {
  return gulp
    .src(scripts)
    .pipe(concat(pkg.name + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
}


// Watch for file changes
function watch() {
  gulp.watch(paths.sassPattern, gulp.series(sassLint, sassDev));
  gulp.watch(paths.jsMain, gulp.series(jsLint, jsDev));
}


// Define complex tasks
const jsBuildDev = gulp.series(jsLint, jsDev);
const jsBuildProd = gulp.series(jsLint, jsProd);
const sassBuildDev = gulp.series(sassLint, sassDev);
const sassBuildProd = gulp.series(sassLint, sassProd);
const buildDev = gulp.series(gulp.parallel(sassBuildDev, jsBuildDev), watch);
const buildProd = gulp.series(gulp.parallel(sassBuildProd, jsBuildProd));


// Export tasks to gulp
exports.default = buildDev;
exports.prod = buildProd;
