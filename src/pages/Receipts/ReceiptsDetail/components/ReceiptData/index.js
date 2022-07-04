import React from 'react';
import { ReceiptsEnums } from '../../../index';
import MyEmpty from '../../../../components/MyEmpty';
import InstockOrder from './components/InstockOrder';
import Process from '../../../../Work/PurchaseAsk/components/Process';
import Comments from '../../../components/Comments';
import style from './index.less';
import InstockError from './components/InstockError';
import Stocktaking from './components/Stocktaking';
import Maintenance from './components/Maintenance';
import StepList from '../Dynamic/components/StepList';

const ReceiptData = (
  {
    data = {},
    currentNode,
    refresh = () => {
    },
    loading,
    permissions,
    addComments = () => {
    },
  }) => {

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push({ action: item.action, id: item.documentsActionId });
      });
    }
    return null;
  });

  const getAction = (action) => {
    const actionData = actions.filter(item => {
      return item.action === action;
    });
    return actionData[0] || {};
  };

  const receiptType = () => {
    switch (data.type) {
      case ReceiptsEnums.instockOrder:
      case ReceiptsEnums.outstockOrder:
        return <InstockOrder
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refresh}
          loading={loading}
          type={data.type}
        />;
      case ReceiptsEnums.instockError:
        return <InstockError
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refresh}
        />;
      case ReceiptsEnums.stocktaking:
        return <Stocktaking
          permissions={permissions}
          receipts={data.receipts}
          getAction={getAction}
          refresh={refresh}
        />;
      case ReceiptsEnums.maintenance:
        return <Maintenance
          getAction={getAction}
          refresh={refresh}
          permissions={permissions}
          receipts={data.receipts}
        />;
      default:
        return <MyEmpty />;
    }
  };

  const remarks = data.remarks || [];

  return <>
    {receiptType()}
    <Process auditData={data.stepsResult} createUser={data.user} card />
    <Comments detail={data} id={data.processTaskId} refresh={refresh} onInput={addComments} />
    <div className={style.comments}>
      <StepList remarks={remarks.filter(item => ['comments'].includes(item.type))} />
    </div>
  </>;
};

export default ReceiptData;
