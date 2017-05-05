const webpackConfig = require("./webpack.config.js");

var testEnvironment = process.env.TEST_ENVIRONMENT || 'prod';

console.log('Testing with test environment: ', testEnvironment);

var karmaConfig = {
    basePath: '',

    frameworks: ['jasmine'],

    exclude:[],

    files: [
        {pattern: './src/main.test.ts', watched: false},
        {pattern: './src/styles.css', watched: false},
        {pattern: './src/assets/icons/interactor-icons.css', watched: false}
    ],

    preprocessors: {
        './src/main.test.ts':["webpack", 'sourcemap']
    },
    webpack: webpackConfig,

    webpackServer: {noInfo: true},

    port: 9876,

    colors: true,
    
    reporters: ["spec"],
    
    specReporter: {
        maxLogLines: 5,         // limit number of lines logged per test
        suppressErrorSummary: true,  // do not print error summary
        suppressFailed: false,  // do not print information about failed tests
        suppressPassed: false,  // do not print information about passed tests
        suppressSkipped: true,  // do not print information about skipped tests
        showSpecTiming: true // print the time elapsed for each spec
    },

    browsers: ['Chrome'],

    mime: {
        'text/x-typescript': ['ts','tsx']
    },

    concurrency: Infinity,

    autoWatch: false,

    singleRun: true,
};

if(testEnvironment == 'dev'){
    karmaConfig.autoWatch = true;
    karmaConfig.singleRun = false;
}

module.exports = function (config) {
    config.set(karmaConfig);
};
