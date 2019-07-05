module.exports = {
    baseUrl: './',

    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://10.121.14.103:8013/',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}