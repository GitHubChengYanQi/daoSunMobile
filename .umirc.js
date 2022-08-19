import React from 'react';

const pxtoviewport = require('postcss-px-to-viewport');
// ref: https://umijs.org/config/

export default {
  // treeShaking: true,

  theme: {
    // '@primary-color': '#CDDC39',
  },

  publicPath: ['test','daoxin'].includes(process.env.ENV)? '/' : '/cp/',
  history: { type: 'hash' },

  hash: true,
  // fastRefresh: {},


  antd: false,
  dva: {},
  dynamicImport: {
    loading: '@/Loading',
  },
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
