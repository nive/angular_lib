
(function () {
'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        replaceString: /\bgulp[\-.]/
    }),
    pkg = require('./package.json'),
    banner = ['// (c) 2013-<%= now.getFullYear() %> Nive GmbH - nive.io',
        '// ',
        '// <%= pkg.name %> v<%= pkg.version %>',
        '// ',
        '// License: Released under MIT-License. See http://jquery.org/license',
        '// Docs: http://www.nive.co/docs/webapi',
        '//',
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
    gulp.src(['./src/nive.js', './src/resource/endpoint.js', './src/resource/adapter.js', './src/services/*.js'])
        .pipe(plugins.concat('nive-angular-' + pkg.version + '.js'))
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

gulp.task('test', function() {

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

}());