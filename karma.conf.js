module.exports = function(config) {

    var pkg = require('./package.json');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'vendor/nive/endpoint-0.7.1.js',
            'vendor/angular/angular.js',
            'vendor/angular-mocks/angular-mocks.js',
            'dist/angular-nive-' + pkg.version + '.js',
            'test/**/*.spec.js'
        ],
        reporters: ['dots'],
        autoWatch: false,
        singleRun: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS']
    });
}
