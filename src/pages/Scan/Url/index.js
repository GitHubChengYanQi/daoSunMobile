export const storehousePositionsTreeView = {
  url: '/storehousePositions/treeView',
  method: 'GET',
  rowKey: 'storehousePositionsId',
};


export const stockDetailsList = {
  url: '/stockDetails/list',
  method: 'POST',
};


export const outstockOrderList = {
  url: '/outstockOrder/list',
  method: 'POST',
};

export const outstockOrderDetail = {
  url: '/outstockOrder/detail',
  method: 'POST',
};

export const outstockGetOrder = {
  url: '/outstockOrder/getOrder',
  method: 'POST',
};

export const outstockList = {
  url: '/outstock/list',
  method: 'POST',
  rowKey:'outstockId'
};

export const outstockListingList = {
  url: '/outstockListing/list',
  method: 'POST',
  rowKey:'outstockListingId'
};

export const stockDetailsView = {
  url: '/viewStockDetails/list',
  method: 'POST',
};

export const skuList = {
  url: '/sku/list',
  method: 'POST',
};

export const skuStockDetail = {
  url: '/stockDetails/getDetailsBySkuId',
  method: 'POST',
};

