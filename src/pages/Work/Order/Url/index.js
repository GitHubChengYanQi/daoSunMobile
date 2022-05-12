
export const orderList = {
  url: '/order/list',
  method: 'POST',
  rowKey:'orderId'
};

export const instockOrderList = {
  url: '/instockOrder/list',
  method: 'POST',
  rowKey:'instockOrderId'
};
export const instockOrderDetail = {
  url: '/instockOrder/detail',
  method: 'POST',
  rowKey:'instockOrderId'
};

export const checkNumberTrue = {
  url: '/instockOrder/checkNumberTrue',
  method: 'POST',
  rowKey:'instockOrderId'
};


export const orderDetail = {
  url: '/order/detail',
  method: 'POST',
  rowKey:'orderId'
};


export const procurementOrderList = {
  url: '/procurementOrder/list',
  method: 'POST',
  rowKey:'procurementOrderId'
};

export const procurementOrderDetail = {
  url: '/procurementOrder/detail',
  method: 'POST',
  rowKey:'procurementOrderId'
};

export const procurementOrderDetailEdit = {
  url: '/procurementOrderDetail/edit',
  method: 'GET',
};

export const procurementOrderDetailList = {
  url: '/procurementOrderDetail/list',
  method: 'POST',
  rowKey:'orderDetailId'
};

