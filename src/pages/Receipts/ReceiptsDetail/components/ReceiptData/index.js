import React, { useRef, useState } from 'react';
import { ReceiptsEnums } from '../../../index';
import MyEmpty from '../../../../components/MyEmpty';
import InstockOrder from './components/InstockOrder';
import Process from '../../../../Work/PurchaseAsk/components/Process';
import Comments from '../../../components/Comments';
import InstockError from './components/InstockError';
import Stocktaking from './components/Stocktaking';
import Maintenance from './components/Maintenance';
import Allocation from './components/Allocation';
import CommentsList from './CommentsList';

const ReceiptData = (
  {
    success,
    data = {},
    currentNode,
    refresh = () => {
    },
    loading,
    permissions,
    addComments = () => {
    },
    actionButton,
  }) => {

  const [bottomButton, setBottomButton] = useState(false);

  const refreshOrder = () => {
    refresh();
    setBottomButton(false);
  };

  const actions = [];
  currentNode.map((item) => {
    if (item.auditRule && Array.isArray(item.auditRule.actionStatuses)) {
      return item.auditRule.actionStatuses.map((item) => {
        return actions.push({ action: item.action, id: item.actionId });
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
          afertShow={() => setBottomButton(true)}
          taskId={data.processTaskId}
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refreshOrder}
          loading={loading}
          type={data.type}
          taskDetail={data}
        />;
      case ReceiptsEnums.error:
        return <InstockError
          afertShow={() => setBottomButton(true)}
          loading={loading}
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refreshOrder}
        />;
      case ReceiptsEnums.stocktaking:
        return <Stocktaking
          afertShow={() => setBottomButton(true)}
          loading={loading}
          permissions={permissions}
          receipts={data.receipts}
          getAction={getAction}
          refresh={refreshOrder}
        />;
      case ReceiptsEnums.maintenance:
        return <Maintenance
          afertShow={() => setBottomButton(true)}
          loading={loading}
          getAction={getAction}
          refresh={refreshOrder}
          permissions={permissions}
          receipts={data.receipts}
        />;
      case ReceiptsEnums.allocation:
        return <Allocation
          taskId={data.processTaskId}
          afertShow={() => setBottomButton(true)}
          success={success}
          loading={loading}
          permissions={permissions}
          getAction={getAction}
          data={data.receipts}
          refresh={refreshOrder}
        />;
      default:
        return <MyEmpty />;
    }
  };

  const remarks = data.remarks || [];

  return <div>
    {receiptType()}
    <Process
      remarks={remarks.filter(item => 'audit' === item.type)}
      auditData={data.stepsResult}
      version={data.version}
      createUser={data.user}
    />
    <CommentsList detail={data} addComments={addComments} taskId={data.processTaskId} />
    <div hidden={!actionButton || !bottomButton} style={{ height: 60, marginTop: 3 }} />
  </div>;
};

export default ReceiptData;
