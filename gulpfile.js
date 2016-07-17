'use strict';

var gulp = require('gulp');
var del = require('del');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var ngTemplates = require('gulp-ng-templates');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var pm2 = require('pm2');

var processName = 'server';

gulp.task('server', function() {
    livereload.listen();
    nodemon({
        script: 'app.js',
        ext: 'js coffee ejs',
        stdout: false
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});
var rootFolder = __dirname + "/public/";
var dist = rootFolder + "dist/";
var src = rootFolder + "src/";
var lib = src + "bower_components/";
var app = src + "app/";
var assets = src + "assets/";

gulp.task('build-html', function() {
    gulp.src(rootFolder + 'index.html')
        .pipe(htmlreplace({
            'vendor-css': 'css/vendor.min.css',
            'app-css': 'css/app.min.css',
            'vendor-js': 'js/vendor.min.js',
            'app-js': 'js/app.min.js',
            'template-js': 'js/templates.js'
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('build-vendor-js', function() {
    var libraryJSFilesList = [
        lib + 'angular/angular.min.js',
        lib + 'angular-aria/angular-aria.min.js',
        lib + 'angular-animate/angular-animate.min.js',
        lib + 'angular-material/angular-material.min.js',
        lib + 'angular-ui-router/release/angular-ui-router.min.js'
    ];
    gulp.src(libraryJSFilesList)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(dist + "js/"));

});
gulp.task('build-app-js', function() {

    var appJSFilesList = [
        app + 'app.js',
        app + 'app.config.js',
        app + 'app.route.js',
        app + '*/*Ctrl.js',
        app + '*/*Service.js',
        app + '*/*Directive.js'

    ];
    gulp.src(appJSFilesList)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(dist + "js/"))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist + "js/"));


});

gulp.task('build-vendor-css', function() {
    gulp.src(lib + '*/*.min.css')
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('build-app-css', function() {
    gulp.src(assets + 'css/*.css')
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dist + "css/"))
        .pipe(rename('app.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(dist + "css/"));
});
gulp.task('build-template', function() {
    gulp.src(app + "*/*.html")
        .pipe(ngTemplates({
            module: 'templates',
            standalone: true,
            filename: 'templates.js',
            path: function(path, base) {
                return path.replace(base, 'src/app/');
            }
        }))
        .pipe(gulp.dest(dist + 'js'));

});
gulp.task('copy-image', function() {
    gulp.src(assets + 'img/*')
        .pipe(gulp.dest(dist + 'img/'));
});
gulp.task('clean', function() {
    del.sync(dist + "/*");
});

gulp.task('pm2:stop', function() {
    pm2.connect(function() {
        pm2.stop("app.js", processName);
    });
});

gulp.task('pm2:start', function() {
    pm2.connect(function() {
        pm2.start("app.js", processName);
    });
});


gulp.task('dev', [
    'server'
]);
gulp.task('build-js', ['build-vendor-js', 'build-app-js']);
gulp.task('build-css', ['build-vendor-css', 'build-app-css']);
gulp.task('build', function(callback) {
    runSequence(['clean'], ['build-html', 'build-template'], 'build-js', 'build-css', 'copy-image', callback);
});
gulp.task('prod', ['build'], function() {
    gulp.start('server');
});


gulp.task('default', ['prod']);
