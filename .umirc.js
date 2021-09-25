
const pxtoviewport = require('postcss-px-to-viewport');
// ref: https://umijs.org/config/
export default {
  treeShaking: true,

  theme: {
    // '@primary-color': '#CDDC39',
  },

  extraPostCSSPlugins: [
    pxtoviewport({
      viewportWidth: 750,
      viewportHeight: 4925,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/dumi/],
    }),
  ],
  // routes: [
    // {
    //   path: '/',
    //   component: '../layouts/index',
    //   routes: [
    //     { path: '/', component: '../pages/index' }
    //   ]
    // }
  // ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'daoSunMobile',
      dll: false,


      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
