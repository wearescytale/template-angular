'use strict';

var gulp            = require('gulp'),
    watch           = require('gulp-watch'),
    autoprefixer    = require('gulp-autoprefixer'),
    browserSync     = require('browser-sync').create(),
    reload          = browserSync.reload,
    minifyCss       = require('gulp-minify-css'),
    plumber         = require('gulp-plumber'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    sourcemaps      = require('gulp-sourcemaps'),
    templateCache   = require('gulp-angular-templatecache'),
    ngAnnotate      = require('gulp-ng-annotate'),
    install         = require('gulp-install')
    ;

var paths = {
    src: {
        js: {
            vendors: [
                'node_modules/angular/angular.js',
                'node_modules/angular-cookies/angular-cookies.js',
                'node_modules/angular-sanitize/angular-sanitize.js',
                'node_modules/angular-ui-router/build/angular-ui-router.js'
            ],
            app: 'js/**/*.js'
        },
        scss: 'scss/main.scss',
        template: 'js/**/*.html'
    },
    dst: {
        js: 'www/js',
        css: 'www/css'
    },
    watch: {
        scss: 'scss/**/*.scss',
        js: 'js/**/*.js',
        jsVendor: 'www/lib/**/*.js',
        template: 'js/**/*.html'
    }
};

// Sass

gulp.task('sass', function() {
    return gulp.src(paths.src.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['> 5%'],
                cascade: false
            }))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dst.css))
        .pipe(browserSync.stream());
});

gulp.task('watch-sass', ['sass'], function() {
    gulp.watch(paths.watch.scss, ['sass']);
});

// JS Vendor

gulp.task('js-vendor', function() {
    return gulp.src(paths.src.js.vendors)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dst.js))
        .on('end', reload)
    ;
});

gulp.task('watch-js-vendor', ['js-vendor'], function() {
    gulp.watch(paths.watch.jsVendor, ['js-vendor']);
});

// JS

gulp.task('js', function() {
    return gulp.src(paths.src.js.app)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dst.js))
        .on('end', reload)
    ;
});

gulp.task('watch-js', ['js'], function() {
    gulp.watch(paths.watch.js, ['js']);
});

// Templates

gulp.task('templates', function() {
    return gulp.src(paths.src.template)
        .pipe(templateCache({
            standalone: true,
            root: 'js'
        }))
        .pipe(gulp.dest(paths.dst.js))
        .on('end', reload)
    ;
});

gulp.task('watch-templates', ['templates'], function() {
    gulp.watch(paths.watch.template, ['templates']);
});

// Main

gulp.task('watch', ['watch-sass', 'watch-js-vendor', 'watch-templates', 'watch-js']);

gulp.task('server', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: './www'
        }
    });

    gulp.watch(['www/**/*.html'], browserSync.reload);
});

gulp.task('build', ['sass', 'js-vendor', 'templates', 'js']);

gulp.task('default', ['server']);
