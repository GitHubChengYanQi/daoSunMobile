import wx from 'populee-weixin-js-sdk';
import { request } from '../util/Request';
import { history } from 'umi';
import { Toast } from 'antd-mobile';

const scan = () => new Promise((resolve, reject) => {
  wx.ready(() => {
    wx.scanQRCode({
      desc: 'scanQRCode desc',
      needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
      success: (res) => {
        // 回调
        if (res.resultStr.indexOf('https') !== -1) {
          const param = res.resultStr.split('=');
          if (param && param[1]) {
            resolve(param[1]);
          }
        } else {
          resolve(res.resultStr);
        }

      },
      error: (res) => {
        reject(res);
      },
    });
  });
});

export default {
  namespace: 'qrCode',
  state: {},
  reducers: {
    //改变state
    scanCodeState(state, { payload }) {
      console.log('state', payload);
      return { ...state, ...payload };
    },
    // 清楚二维码
    clearCode(state) {
      console.log('clearCode');
      return { ...state, codeId: null };
    },
  },

  effects: {
    // 企业微信扫码
    * wxCpScan({ payload }, { call, put }) {
      yield put({ type: 'clearCode' });
      console.log('wxCpScan');
      if (process.env.ENV === 'test') {
        let code = '1475360769512423425'; // 入库
        // let code = '1475358083438198786'; // 出库
        // let code = '1475357188682711042'; // 实物
        yield put({ type: 'backObject', payload: { code, ...payload } });
      } else {
        const result = yield call(scan);
        yield put({ type: 'backObject', payload: { code: result, ...payload } });
      }

    },

    // 扫码跳路由
    * router({ payload }, { put }) {
      const codeId = payload.codeId;
      const type = payload.type;
      yield put({ type: 'clearCode' });
      switch (type) {
        case 'spu':
          // history.push(`/Scan/Spu?id=${codeId}`);
          break;
        case 'storehouse':
          // history.push(`/Scan/Storehouse?id=${codeId}`);
          break;
        case 'storehousePositions':
          // history.push(`/Scan/StorehousePositions?id=${codeId}`);
          break;
        case 'stock':
          // history.push(`/Scan/Stock?id=${codeId}`);
          break;
        case 'instock':
          history.push(`/Scan/InStock?id=${codeId}`);
          break;
        case 'outstock':
          history.push(`/Scan/OutStock?id=${codeId}`);
          break;
        default:
          break;
      }
      yield;
    },


    // 扫码入库操作
    * scanInstock({ payload }, { call, put }) {
      const codeId = payload.codeId;
      const items = payload.items;
      const batch = payload.batch;
      // 判断二维码是否绑定
      const isBind = yield call(() => request(
        {
          url: '/orCode/isNotBind',
          method: 'POST',
          data: {
            codeId: codeId,
          },
        },
      ));

      if (isBind) {
        // 已经绑定
        // 判断二维码和物料是否对应
        const judgeBind = yield call(() => request({
          url: '/orCode/judgeBind',
          method: 'POST',
          data: {
            codeId: codeId,
            ...items,
          },
        }));
        if (judgeBind) {
          // 如果一致,选择库位进行入库
          yield put({ type: 'scanCodeState', payload: { instockAction: judgeBind } });
        } else {
          //不一致报错
          Toast.show({
            content: '二维码已绑定其他物料，或物料已绑定其他二维码！请重新选择!',
            position: 'bottom',
          });
          yield put({ type: 'clearCode' });
        }
      } else {
        // 未绑定
        // 是否是批量
        if (batch) {
          yield put({ type: 'scanCodeState', payload: { batchBind: true } });
        } else {
          // 不是批量提示是否绑定
          yield put({ type: 'scanCodeState', payload: { bind: true } });
        }
      }

    },

    // 扫描库位
    * scanStorehousePositon({ payload }, { put }) {
      const res = payload.res;
      const data = payload.data;
      if (res.type === 'storehousePositions') {
        if (res.result && res.result.storehouseId) {
          if (res.result.storehouseId === data.storeHouseId) {
            yield put({ type: 'scanCodeState', payload: { stroeHousePostion: res.result } });
          } else {
            Toast.show({
              content: `请扫[ ${data.storehouseResult && data.storehouseResult.name} ] 的码！`,
              icon: 'fail',
              position: 'bottom',
            });
          }
        }

      } else {
        Toast.show({
          content: '请扫库位码！',
          position: 'bottom',
        });
      }
    },

    // 扫码出库
    * scanOutstock({ payload }, { call, put }) {
      const codeId = payload.codeId;
      const items = payload.items;
      const data = payload.data;

      // 取出二维码对应的实物信息
      const res = yield call(() => request({
        url: '/orCode/backInkindByCode',
        method: 'POST',
        data: {
          codeId,
          id: items && items.skuId,
          brandId: items && items.brandId,
          storehouse: data && data.storehouseId,
        },
      }));
      console.log(res);
      if (JSON.stringify(res) !== '{}' && res.stockDetails){
        yield put({ type: 'scanCodeState', payload: { outstockAction:res } });
      }
    },


    // wxCp获取二维码数据
    * backObject({ payload }, { call, put }) {
      console.log('wxCpbackObject', payload);
      const codeId = payload.code;
      const action = payload.action;
      // 入库参数
      const items = payload.items;
      const batch = payload.batch;

      // 选择库位参数
      const data = payload.data;

      let res = {};
      if (!action || action === 'scanStorehousePositon') {
        res = yield call(() => request({
          url: '/orCode/backObject',
          method: 'GET',
          params: {
            id: codeId,
          },
        }), codeId);
      }


      if (codeId) {
        switch (action) {
          case 'scanStorehousePositon':
            // 扫描库位
            yield put({ type: 'scanStorehousePositon', payload: { res, data } });
            break;
          case 'scanInstock':
            // 扫码入库操作
            if (items) {
              yield put({ type: 'scanCodeState', payload: { codeId } });
              yield put({ type: 'scanInstock', payload: { codeId, items, batch } });
            }
            break;
          case 'scanOutstock':
            // 扫码出库操作
            if (items) {
              yield put({ type: 'scanCodeState', payload: { codeId } });
              yield put({ type: 'scanOutstock', payload: { codeId, items, data } });
            }
            break;
          default:
            // 没有动作跳路由
            // 获取数据
            yield put({ type: 'router', payload: { codeId, type: res.type } });
            break;
        }

      }
    },

    // app获取二维码数据
    * appAction({ payload }, { select, call, put }) {
      const states = yield select(states => states['qrCode']);
      const codeId = payload.code;
      const action = states.action;
      switch (action) {
        case 'instock':
        case 'outstock':
          yield put({ type: 'scanCodeState', payload: { codeId } });
          break;
        default:
          // 没有动作跳路由
          // 获取数据
          const res = yield call(() => request({
            url: '/orCode/backObject',
            method: 'GET',
            params: {
              id: codeId,
            },
          }));
          yield put({ type: 'router', payload: { codeId, type: res.type } });
          break;
      }

    },
  },
};