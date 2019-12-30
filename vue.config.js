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
            '/test_kmfx1_api': {
                target: 'http://test.kmfx1.com', // 测试环境
                changOrigin: true,
                pathRewrite: {
                    '^/test_kmfx1_api': ''
                }
            },
            '/app': {
                target: 'http://mallcs.kmfx1.com',
                changOrigin: true,
            }
        }
    }
}
