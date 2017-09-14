const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const csscomments = require('gulp-strip-css-comments');
const cssmin = require('gulp-cssmin');
const eventStream = require('event-stream');
const gulp = require('gulp');
const htmlMin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const minify = require('gulp-minify');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
const uglifyCss = require('gulp-uglifycss');
const watch = require('gulp-watch');

/*
 * VARIABLES
 * =================================================
 */

let vendorStylesheets = [
    './node_modules/normalize.css/normalize.css',
    './node_modules/animate.css/animate.min.css'
];

let vendorScripts = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/angular/angular.min.js',
    './node_modules/angular-route/angular-route.min.js',
    './node_modules/angular-sanitize/angular-sanitize.min.js',
    './node_modules/wow.js/dist/wow.min.js'
];

let fonts = [
    'stylesheets/fonts/fontawesome*.*',
];

let icons = [''];

let appScripts = [
    'scripts/js/app.js',
    'scripts/js/Configs/*.js',
    'scripts/js/Controllers/*.js',
    'scripts/js/Filters/*.js',
    'scripts/js/Routes/*.js',
    'scripts/js/Services/*.js',
    'scripts/js/Values/*.js',
    'scripts/js/Values/Mocks/*.js'
];

let myScripts = [
    'scripts/js/navbarScroll.js'
];

//=================================================

gulp.task('sass', ['cleanCss'], function() {
    eventStream.merge([
            gulp.src(vendorStylesheets),
            gulp.src('./stylesheets/scss/main.scss')
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 3 version'],
                cascade: false
            }))
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.css'))
        .pipe(uglifyCss({ "maxLineLen": 80, "uglyComments": true }))
        .pipe(cssmin())
        .pipe(csscomments({ all: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./stylesheets/css'));
});

gulp.task('verifyJs', function() {
    return gulp.src('scripts/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('uglifyApp', ['cleanAppJs'], function() {
    return gulp.src(appScripts)
        .pipe(concat('appAll.min.js'))
        //.pipe(uglify({ mangle: false }))
        .pipe(minify({ ext: '.js', mangle: false }))
        .pipe(gulp.dest('scripts/'));
});

gulp.task('uglifyLib', ['cleanLibJs'], function() {
    return gulp.src(vendorScripts)
        .pipe(concat('libAll.min.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(minify({ ext: '.js', mangle: false }))
        .pipe(gulp.dest('scripts/'));
});

gulp.task('cleanLibJs', function() {
    gulp.src('./scripts/libAll*.*')
        .pipe(clean());
});

gulp.task('cleanAppJs', function() {
    gulp.src('./scripts/appAll*.*')
        .pipe(clean());
});

gulp.task('cleanCss', function() {
    gulp.src('./stylesheets/css/main.css')
        .pipe(clean());
});

gulp.task('cleanDist', function() {
    gulp.src('./dist')
        .pipe(clean());
});

gulp.task('compressIndex', function() {
    gulp.src('./index.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
            minifyCSS: true,
            removeTagWhitespace: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function() {
    gulp.watch(['./stylesheets/scss/**/*.scss', './stylesheets/scss/*.scss'], ['sass']);
});

gulp.task('app:watch', function() {
    gulp.watch(appScripts, ['uglifyApp']);
});

gulp.task('build', ['cleanDist', 'sass', 'uglifyApp', 'uglifyLib', 'compressIndex'], function() {
    console.log('Compressing HTML');
    gulp.src('views/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
            minifyCSS: true,
            removeTagWhitespace: true
        }))
        .pipe(gulp.dest('dist/views/'));

    console.log('Compressing images');
    gulp.src('images/*.*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(copy('dist/'));

    console.log('Copying Stylesheets');
    gulp.src('stylesheets/css/*.*').pipe(copy('dist/'));

    console.log('Copying Font files');
    gulp.src(fonts).pipe(copy('dist'));

    console.log('Copying Icons files');
    gulp.src(icons).pipe(copy('dist'));

    console.log('Compressing JS Libraries');
    gulp.src('scripts/libAll.min.js').pipe(copy('./dist'));

    console.log('Compressing JS Applications');
    gulp.src('scripts/appAll.min.js').pipe(copy('./dist'));

    console.log('Copying and Compressing scripts');
    gulp.src(myScripts)
        .pipe(uglify())
        .pipe(minify({ ext: '.js', mangle: false }))
        .pipe(gulp.dest('./dist'));
});