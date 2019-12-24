module.exports = {
  devServer: {
    port: 5001,
    proxy: {
      '/api/v1/*': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/users/api/readvalues': {
        target: 'http://localhost:5000'
      }
    }
  },
  runtimeCompiler: true,
  assetsDir: process.env.NODE_ENV === 'production' ? '../static' : 'dist',
  outputDir: process.env.NODE_ENV === 'production' ? '../app/templates' : 'dist'
}
