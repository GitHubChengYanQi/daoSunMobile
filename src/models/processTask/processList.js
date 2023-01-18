export default {
  namespace: 'processList',
  state: {
    key: 'create',
    taskParams: {
      status: '2',
    },
    params: { queryType: 1 },
    createUserParams: {},
    taskScreen: {},
    screen: {},
    createUserScreen: {},
    auditKey: 'audit',
    taskAuditKey: 'actioning',
  },
  reducers: {
    stateChange(state, { payload }) {
      return { ...state, ...payload };
    },
    tabKeyChange(state, { payload }) {
      return { ...state, ...payload };
    },
    taskParamsChange(state, { payload }) {
      return { ...state, ...payload };
    },
    createUserParamsChange(state, { payload }) {
      return { ...state, ...payload };
    },
    paramsChange(state, { payload }) {
      return { ...state, ...payload };
    },
    taskScreenChange(state, { payload }) {
      return { ...state, ...payload };
    },
    createUserScreenChange(state, { payload }) {
      return { ...state, ...payload };
    },
    screenChange(state, { payload }) {
      return { ...state, ...payload };
    },
    auditKeyChange(state, { payload }) {
      return { ...state, ...payload };
    },
    taskAuditKeyChange(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {},
};
