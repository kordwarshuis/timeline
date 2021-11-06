module.exports = {

  // https://cli.vuejs.org/config/#publicpath

  //=============
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PATH : '/',
  //=============
};