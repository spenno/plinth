'use strict';

//
// Load plugins
//
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const minify = require('gulp-clean-css');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');





//
// Load package file
//
const pkg = require('./package.json');





//
// Paths
//
const paths = {
  dist: 'dist/',
  jsMain: 'js/main.js',
  nodeModules: 'node_modules/',
  sassMain: 'stylesheets/main.scss',
  sassPattern: 'stylesheets/**/*.scss'
};





//
// Scripts to concat
//
const scripts = [
  paths.nodeModules + 'babel-polyfill/dist/polyfill.js',
  paths.nodeModules + 'jquery/dist/jquery.js',
  paths.jsMain
];





//
// Specify Node Sass as the Sass compiler
//
sass.compiler = require('node-sass');





//
// Sass linting with stylelint
//
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





//
// JavaScript linting with JSHint
//
function jsLint() {
  return gulp
    .src(paths.jsMain)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}





//
// Compile Sass for development
//
function sassDev() {
  return gulp
    .src(paths.sassMain)
    .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist));
}





//
// Compile Sass for production
//
function sassProd() {
  return gulp
    .src(paths.sassMain)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
      .pipe(minify())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist));
}





//
// Compile JavaScript for development
//
function jsDev() {
  return gulp
    .src(scripts)
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat(pkg.name + '.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
}





//
// Compile JavaScript for production
//
function jsProd() {
  return gulp
    .src(scripts)
    .pipe(babel())
    .pipe(concat(pkg.name + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
}





//
// Watch for Sass and JavaScript changes
//
function watch() {
  gulp.watch(paths.sassPattern, gulp.series(sassLint, sassDev));
  gulp.watch(paths.jsMain, gulp.series(jsLint, jsDev));
}





//
// Define complex tasks
//
const jsBuildDev = gulp.series(jsLint, jsDev);
const jsBuildProd = gulp.series(jsLint, jsProd);
const sassBuildDev = gulp.series(sassLint, sassDev);
const sassBuildProd = gulp.series(sassLint, sassProd);
const buildDev = gulp.series(gulp.parallel(sassBuildDev, jsBuildDev), watch);
const buildProd = gulp.series(gulp.parallel(sassBuildProd, jsBuildProd));





//
// Export tasks to Gulp
//
exports.default = buildDev;
exports.prod = buildProd;
