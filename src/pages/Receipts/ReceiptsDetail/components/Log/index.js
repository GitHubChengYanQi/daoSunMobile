import React from 'react';
import InStockLog from './InStockLog';
import { ToolUtil } from '../../../../components/ToolUtil';
import OutStockLog from './OutStockLog';
import { ReceiptsEnums } from '../../../index';
import MyEmpty from '../../../../components/MyEmpty';
import StocktaskingLog from './StocktaskingLog';

const Log = ({ type, detail = {} }) => {

  switch (type) {
    case ReceiptsEnums.instockOrder:
      return <InStockLog instockOrderId={ToolUtil.isObject(detail.receipts).instockOrderId} />;
    case ReceiptsEnums.outstockOrder:
      return <OutStockLog outstockOrderId={ToolUtil.isObject(detail.receipts).pickListsId} />;
    case ReceiptsEnums.stocktaking:
      return <StocktaskingLog detail={detail.receipts} />;
    default:
      return <MyEmpty description='暂无记录' />;
  }
};

export default Log;
