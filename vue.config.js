// vue.config.js
module.exports = {
    // options...
    runtimeCompiler: true,
    publicPath: process.env.NODE_ENV === 'production'
    ? '/ui/turner-1.0/'
    : '/'
  }