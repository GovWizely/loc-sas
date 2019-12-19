module.exports = {
  devServer: {
    proxy: 'http://localhost:5000',
    port: 5001
  },
  runtimeCompiler: true,
  assetsDir: process.env.NODE_ENV === 'production' ? '../static' : 'dist',
  outputDir: process.env.NODE_ENV === 'production' ? '../app/templates' : 'dist'
}
