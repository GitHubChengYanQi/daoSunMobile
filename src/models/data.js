import { request } from '../util/Request';
import { ToolUtil } from '../pages/components/ToolUtil';

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
      const sysMenus = payload.sysMenus || [];
      const userMenus = yield call(() => request({ url: '/mobelTableView/viewDetail', method: 'GET' }));
      const newUserMenus = ToolUtil.isArray(userMenus.details).filter(item => {
        if (item.code === 'LogOut') {
          return false;
        }
        let exist = false;
        sysMenus.forEach(menuItem => {
          const subMenus = menuItem.subMenus || [];
          subMenus.forEach(subMenuItem => {
            if (subMenuItem.code === item.code) {
              exist = true;
            }
          });
          if (menuItem.id === item.code) {
            exist = true;
          }
        });
        return exist;
      });
      yield put({
        type: 'setData', payload: { userMenus: newUserMenus },
      });
    },

    // 获取常用图表信息
    * getUserChar({ payload }, { call, put }) {
      const userChart = yield call(() => request({ url: '/mobelTableView/chartDetail', method: 'GET' }));
      yield put({
        type: 'setData', payload: { userChart: ToolUtil.isObject(userChart).details || [] },
      });
    },
  },
};
