const debug = process.env.NODE_ENV !== 'production'

console.log('debug:', debug)

module.exports = {
    // publicPath: '../addons/ewei_shopv2/template/mobile/default/static/score/',
    publicPath: debug ? '/' : '../addons/ewei_shopv2/template/mobile/default/static/score/',
    // filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/apimall': {
                target: 'http://test.kmfx1.com', // 测试环境
                changOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
            '/apii': {
                target: 'http://test.kmfx1.com', // 测试环境
                changOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
            '/app': {
                target: 'http://rrcloud.kmfx1.com',
                changOrigin: true,
            }
        }
    }
}
