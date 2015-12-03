module.exports = function(config) {

    var pkg = require('./package.json');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'vendor/angular/angular.js',
            'vendor/angular-mocks/angular-mocks.js',
            'dist/nive-angular-' + pkg.version + '.js',
            'test/**/test_*.js'
        ],
        reporters: ['dots'],
        autoWatch: false,
        singleRun: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS']
    });
};
