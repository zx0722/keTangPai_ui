let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    target: 'http://127.0.0.1:8046',
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