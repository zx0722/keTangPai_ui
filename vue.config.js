let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    target: 'http://172.26.172.1:8046',
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