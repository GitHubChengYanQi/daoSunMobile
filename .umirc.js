import React from 'react';

const pxtoviewport = require('postcss-px-to-viewport');
// ref: https://umijs.org/config/
export default {
  // treeShaking: true,

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
      exclude: [/dumi/, /ant/],
    }),
  ],

  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/cp/',
  history: { type: 'hash' },

  antd: false,
  dva: {},
  dynamicImport: {
    loading: '@/Loading',
  },
  title: '道昕云',
  dll: false,

  // routes: {
  //   exclude: [
  //     /models\//,
  //     /services\//,
  //     /model\.([tj])sx?$/,
  //     /service\.([tj])sx?$/,
  //     /components\//,
  //   ],
  // },

};
