'use strict';
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        replaceString: /\bgulp[\-.]/
    }),
    pkg = require('./package.json'),
    banner = ['/**',
        ' * (c) 2013-<%= now.getFullYear() %> Nive GmbH - www.nive.co',
        ' * ',
        ' * <%= pkg.name %> v<%= pkg.version %>',
        ' * <%= pkg.homepage %>',
        ' * ',
        ' * License: <%= pkg.license %>',
        ' */',
        ''].join('\n');

// -------------------------
// Tasks
// -------------------------

gulp.task('bump', function(opts) {
    gulp.src(['./bower.json', './package.json'])
        .pipe(plugins.bump(opts))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', function(cb) {
    require('del')(['./dist/*'], cb);
});

gulp.task('lint', function() {
    gulp.src([
        'gulpfile.js',
        'src/**/*.js'
    ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('scripts', function() {
    gulp.src(['./src/angular-nive.js', './src/**/*.js'])
        .pipe(plugins.concat('angular-nive-' + pkg.version + '.js'))
        .pipe(plugins.header(banner, {
            pkg: pkg,
            now: new Date()
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(plugins.header(banner, {
            pkg: pkg,
            now: new Date()
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('unit', function() {

    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

gulp.task('watch', ['lint', 'scripts'], function () {
    gulp.watch(['src/**/*.js'], ['lint', 'clean', 'scripts']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('watch');
});
