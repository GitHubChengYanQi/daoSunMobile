export default {
  namespace: 'shop',
  state: {
    refresh: false,
  },
  reducers: {
    refreshShop(state, { payload }) {
      return { refresh: payload.refresh };
    },
  },
  effects: {},
};
