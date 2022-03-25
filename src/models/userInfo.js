import { request } from '../util/Request';

export default {
  namespace: 'userInfo',
  state: {},
  reducers: {
    //改变state
    setUserInfo(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    // 获取用户信息
    * getUserInfo({ payload }, { call, put }) {
      const userInfo = yield call(() => request(
        {
          url: '/rest/mgr/getMyInfo',
          method: 'POST',
        },
      ));
      const customer = yield call(() => request(
        {
          url: '/customer/detail',
          method: 'POST',
        },
      ));
      yield put({
        type: 'setUserInfo', payload: {
          ...userInfo,
          abbreviation: customer.abbreviation,
          customerName: customer.customerName,
          customerId: customer.customerId,
        },
      });
    },
  },
};
