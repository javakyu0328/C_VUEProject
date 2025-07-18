const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  // 개발 서버 프록시 설정
  devServer: {
    port: 8082, // 포트를 8082로 고정
    proxy: {
      '/api': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        onProxyReq: function(proxyReq, req, res) {
          // 프록시 요청 헤더 수정
          proxyReq.setHeader('Origin', 'http://localhost:8083');
        }
      }
    }
  }
})
