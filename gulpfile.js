'use strict';

/**
 * Load plugins
 */
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browsersync = require('browser-sync').create();
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-clean-css');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');





/**
 * Load package file
 */
const pkg = require('./package.json');





/**
 * Paths
 */
const paths = {
  dist: 'dist/',
  distFiles: 'dist/**',
  distCSS: 'dist/css/',
  distImages: 'dist/images/',
  distJS: 'dist/js/',
  html: 'src/html/**/*.html',
  images: 'src/images/**/*.+(png|jpg|jpeg|gif|svg)',
  jsMain: 'src/js/main.js',
  nodeModules: 'node_modules/',
  scssMain: 'src/scss/main.scss',
  scssPattern: 'src/scss/**/*.scss'
};





/**
 * Scripts
 */
const scripts = [
  // paths.nodeModules + 'path/to/project/specific/script',
  paths.jsMain
];





/**
 * Specify Node Sass as the Sass compiler
 */
sass.compiler = require('node-sass');





/**
 * Browsersync
 */
function browsersyncInit(done) {
  browsersync.init({
    server: {
      baseDir: paths.dist
    }
  });
  done();
}

function browsersyncReload(done) {
  browsersync.reload();
  done();
}





/**
 * Sass linting with stylelint
 */
function sassLint() {
  return gulp
    .src(paths.scssPattern)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
}





/**
 * JavaScript linting with ESLint
 */
function jsLint() {
  return gulp
    .src(paths.jsMain)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}





/**
 * Straight copy of HTML across to dist during development
 */
function htmlDev() {
  return gulp
    .src(paths.html)
    .pipe(gulp.dest(paths.dist));
}





/**
 * Minify HTML for production
 */
function htmlProd() {
  return gulp
    .src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.dist));
}





/**
 * Compile Sass for development
 */
function sassDev() {
  return gulp
    .src(paths.scssMain)
    .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(paths.distCSS))
    .pipe(browsersync.stream());
}





/**
 * Compile Sass for production
 */
function sassProd() {
  return gulp
    .src(paths.scssMain)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat(pkg.name + '.css'))
      .pipe(minify())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(paths.distCSS));
}





/**
 * Compile JavaScript for development
 */
function jsDev() {
  return gulp
    .src(scripts)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat(pkg.name + '.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.distJS));
}





/**
 * Compile JavaScript for production
 */
function jsProd() {
  return gulp
    .src(scripts)
    .pipe(babel())
    .pipe(concat(pkg.name + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
}





/**
 * Image optimisation
 */
function images() {
  return gulp
    .src(paths.images)
    .pipe(cache(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 7
      }),
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: false
          },
          {
            cleanupIDs: true
          }
        ]
      })
    ])))
    .pipe(gulp.dest(paths.distImages));
}





/**
 * Watch for HTML, Sass, JavaScript and image changes
 */
function watch() {
  gulp.watch(paths.html, gulp.series(htmlDev, browsersyncReload));
  gulp.watch(paths.scssPattern, gulp.series(sassLint, sassDev));
  gulp.watch(paths.jsMain, gulp.series(jsLint, jsDev, browsersyncReload));
  gulp.watch(paths.images, gulp.series(images, browsersyncReload));
}





/**
 * Maintenance tasks
 */

// Clean the dist folder
function cleanDist(done) {
  del(paths.distFiles);
  done();
}

// Clear the image cache
function clearCache(done) {
  cache.clearAll;
  done();
}





/**
 * Define complex tasks
 */
const htmlBuildDev = gulp.series(htmlDev);
const htmlBuildProd = gulp.series(htmlProd);
const sassBuildDev = gulp.series(sassLint, sassDev);
const sassBuildProd = gulp.series(sassLint, sassProd);
const jsBuildDev = gulp.series(jsLint, jsDev);
const jsBuildProd = gulp.series(jsLint, jsProd);
const imagesBuild = gulp.series(images);

const buildDev = gulp.series(gulp.parallel(sassBuildDev, jsBuildDev, imagesBuild, htmlBuildDev), gulp.parallel(watch, browsersyncInit));
const buildProd = gulp.series(gulp.parallel(sassBuildProd, jsBuildProd, imagesBuild, htmlBuildProd));

const clean = gulp.series(cleanDist);
const clear = gulp.series(clearCache);





/**
 * Export the tasks to Gulp
 */
exports.default = buildDev;
exports.prod = buildProd;
exports.cleanDist = clean;
exports.clearCache = clear;
