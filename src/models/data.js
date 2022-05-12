import { request } from '../util/Request';

export default {
  namespace: 'data',
  state: {},
  reducers: {
    //改变state
    setData(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    // 获取用户信息
    * getUserMenus({ payload }, { call, put }) {
      const userMenus = yield call(() => request({ url: '/mobelTableView/detail', method: 'GET' }));
      yield put({
        type: 'setData', payload: { userMenus: userMenus.details || [] },
      });
    },
  },
};
