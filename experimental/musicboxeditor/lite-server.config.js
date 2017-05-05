const proxyMiddleware = require('http-proxy-middleware');

const useGzip = process.env.APP_ENVIRONMENT == 'gzip';

var config = {
    "port": 9100,
    "files": ["./build/**/*.{html,htm,css,js}"],
    "server": {
        "baseDir": "./build",
        middleware: {
            1: proxyMiddleware('/interactor', {
                target: 'http://localhost:8080/',
                changeOrigin: true
            })
        }
    }
};

/*
if(useGzip){
    
    config.server.middleware = { 1 : require('compression')() };
}
*/


module.exports = config;