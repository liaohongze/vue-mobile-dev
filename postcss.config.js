const autoprefixer = require('autoprefixer')
const pxtovw = require('postcss-px-to-viewport')
module.exports = ({ file }) => {
  let vwUnit
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    vwUnit = 375
  } else {
    vwUnit = 750
  }

  return {
    plugins: [
      autoprefixer(),
      pxtovw({
        viewportWidth: vwUnit,
        minPixelValue: 1
      })
    ]
  }
}
