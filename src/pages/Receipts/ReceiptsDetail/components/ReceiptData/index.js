import React, { useState } from 'react';
import { ReceiptsEnums } from '../../../index';
import MyEmpty from '../../../../components/MyEmpty';
import InstockOrder from './components/InstockOrder';
import Process from '../../../../Work/CreatePurchaseOrder/components/Process';
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
  }) => {

  const [bottomButton, setBottomButton] = useState(false);

  const refreshOrder = () => {
    refresh();
    setBottomButton(false);
  };

  const actions = [];
  const logIds = [];
  let actionNode = false;
  currentNode.forEach((item) => {

    if (item.stepType === 'status' && !actionNode) {
      actionNode = true;
    }

    if (data.version) {
      const logResults = item.logResults || [];
      logResults.map(item => {
        logIds.push(item.logId);
      });
    } else {
      const logResult = item.logResult || {};
      logIds.push(logResult.logId);
    }

    if (item.auditRule && Array.isArray(item.auditRule.actionStatuses)) {
      item.auditRule.actionStatuses.map((item) => {
        actions.push({ action: item.action, id: item.actionId, name: item.actionName });
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
          actionNode={actionNode}
          logIds={logIds}
          taskId={data.processTaskId}
          afertShow={() => setBottomButton(true)}
          permissions={permissions}
          data={data.receipts}
          actions={actions}
          getAction={getAction}
          refresh={refreshOrder}
          loading={loading}
          type={data.type}
          taskDetail={data}
        />;
      case ReceiptsEnums.error:
        return <InstockError
          actionNode={actionNode}
          afertShow={() => setBottomButton(true)}
          loading={loading}
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refreshOrder}
          taskDetail={data}
        />;
      case ReceiptsEnums.stocktaking:
        return <Stocktaking
          actionNode={actionNode}
          afertShow={() => setBottomButton(true)}
          loading={loading}
          permissions={permissions}
          receipts={data.receipts}
          getAction={getAction}
          refresh={refreshOrder}
          nodeActions={actions}
          logIds={logIds}
          taskId={data.processTaskId}
          taskDetail={data}
        />;
      case ReceiptsEnums.maintenance:
        return <Maintenance
          actionNode={actionNode}
          nodeActions={actions}
          logIds={logIds}
          taskId={data.processTaskId}
          afertShow={() => setBottomButton(true)}
          loading={loading}
          getAction={getAction}
          refresh={refreshOrder}
          permissions={permissions}
          receipts={data.receipts}
          taskDetail={data}
        />;
      case ReceiptsEnums.allocation:
        return <Allocation
          actionNode={actionNode}
          nodeActions={actions}
          logIds={logIds}
          taskId={data.processTaskId}
          afertShow={() => setBottomButton(true)}
          success={success}
          loading={loading}
          permissions={permissions}
          getAction={getAction}
          data={data.receipts}
          taskDetail={data}
          refresh={refreshOrder}
          createUser={data.createUser}
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
    <div hidden={!bottomButton} style={{ height: 60, marginTop: 3 }} />
  </div>;
};

export default ReceiptData;
