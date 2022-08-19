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
      const userMenus = yield call(() => request({ url: '/mobelTableView/detail', method: 'GET' }));
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
  },
};
