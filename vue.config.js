let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    target: 'http://172.27.35.1:8046',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}