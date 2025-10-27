const { defineConfig } = require("@vue/cli-service");

if (process.env.NODE_ENV === 'production') {
  module.exports = {
	//js.map 파일 생성 안함
    productionSourceMap: false,
    filenameHashing: true,
    configureWebpack: (config) => {
      config.output.filename = "js/[name].js?v=[hash]";
      config.output.chunkFilename = "js/[name].js?v=[hash]";
    },
    devServer: {
      disableHostCheck: true,
      watchOptions: {
        poll: false
      }
    }
  };
} else {
  module.exports = {
	//js.map 파일 생성 안함
    productionSourceMap: false,
    filenameHashing: true,
    configureWebpack: (config) => {
      config.output.filename = "js/[name].js?v=[hash]";
      config.output.chunkFilename = "js/[name].js?v=[hash]";

    },
    devServer: {
      disableHostCheck: true,
      historyApiFallback: true,
      watchOptions: {
        poll: false
      },
      proxy: {
        '/upload/images': { target: 'http://localhost:8443/upload/images', changeOrigin: true, pathRewrite: { "^/upload/images": '' } },
        '/upload/videos': { target: 'http://localhost:8443/upload/videos', changeOrigin: true, pathRewrite: { "^/upload/videos": '' } },
        '/error': { target: 'http://localhost:8443/error', changeOrigin: true, pathRewrite: { "^/error": '' } },
        '/api': { target: 'http://localhost:8443/api', changeOrigin: true, pathRewrite: { "^/api": '' } },
        '/v3-api': { target: 'http://localhost:8443/v3-api', changeOrigin: true, pathRewrite: { "^/v3-api": '' } },
        '/auth-api': { target: 'http://localhost:8443/auth-api', changeOrigin: true, pathRewrite: { "^/auth-api": '' } },
        '/chat-api': { target: 'http://localhost:8443/chat-api', changeOrigin: true, pathRewrite: { "^/chat-api": '' } },
        '/phone-api': { target: 'http://localhost:8443/phone-api', changeOrigin: true, pathRewrite: { "^/phone-api": '' } },
        '/secured/ws-stomp': {
          target: 'http://localhost:8443/secured/ws-stomp',                           //로컬_웹소켓 Poolling 정보 (백엔드 서버정보)  Arthur.Kim
          //target: 'https://dev.hkpalette.com/secured/ws-stomp',                     //운영_웹소켓 Poolling 정보 (백엔드 서버정보)  Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/secured/ws-stomp": ''
          }
        },
        '/sse-api': {
          target: 'http://localhost:8444/sse-api', changeOrigin: true, pathRewrite: { "^/sse-api": '' }
        },
        '/message': {
          target: 'http://localhost:8443/message',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/message": ''
          }
        },
        '/reference': {
          target: 'http://localhost:8443/reference',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/reference": ''
          }
        },
        '/expired_session': {
          target: 'http://localhost:8443/expired_session',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/expired_session": ''
          }
        },
      }
    },
  };
}
