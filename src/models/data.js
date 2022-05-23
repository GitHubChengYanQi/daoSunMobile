import { request } from '../util/Request';

export default {
  namespace: 'data',
  state: {},
  reducers: {
    //改变 state
    setData(state, { payload }) {
      return { ...state, ...payload };
    },
    // 清除 state
    clearState(state) {
      return {};
    },
  },

  effects: {
    // 获取常用菜单信息
    * getUserMenus({ payload }, { call, put }) {
      const userMenus = yield call(() => request({ url: '/mobelTableView/detail', method: 'GET' }));
      yield put({
        type: 'setData', payload: { userMenus: userMenus.details || [] },
      });
    },
  },
};
