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
import { MyLoading } from '../../../../components/MyLoading';
import Allocation from './components/Allocation';

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
          task={data}
          taskId={data.processTaskId}
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refresh}
          loading={loading}
          type={data.type}
        />;
      case ReceiptsEnums.error:
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
      case ReceiptsEnums.allocation:
        return <Allocation
          permissions={permissions}
          getAction={getAction}
          data={data.receipts}
          refresh={refresh}
        />;
      default:
        return <MyEmpty />;
    }
  };

  const remarks = data.remarks || [];

  if (loading) {
    return <MyLoading skeleton skeletonStyle={{ backgroundColor: '#fff', height: 'calc(100% - 166px)' }} />;
  }

  return <div>
    {receiptType()}
    <Process
      remarks={remarks.filter(item => 'audit' === item.type)}
      auditData={data.stepsResult}
      createUser={data.user}
    />
    <Comments title='添加评论' detail={data} id={data.processTaskId} refresh={refresh} onInput={addComments} />
    <div className={style.comments}>
      <StepList remarks={remarks.filter(item => 'comments' === item.type)} />
    </div>
    <div style={{ backgroundColor: '#fff', height: 60, marginTop: 3 }} />
  </div>;
};

export default ReceiptData;
