import { request } from '../util/Request';
import { ToolUtil } from '../util/ToolUtil';

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
      const defaultChart = [
        { code: 'Stock', name: '库存统计', sort: 0 },
        { code: 'ErrorSku', name: '异常分析', sort: 1 },
        { code: 'InventoryRotation', name: '在库天数', sort: 2 },
        { code: 'OrderStatisicalChart', name: '单据统计', sort: 3 },
        { code: 'MaterialAnalysis', name: '物料分析', sort: 4 },
        { code: 'TaskStatisicalChart', name: '任务统计', sort: 5 },
      ];
      yield put({
        type: 'setData', payload: { userChart: ToolUtil.isObject(userChart).details || defaultChart },
      });
    },
  },
};
