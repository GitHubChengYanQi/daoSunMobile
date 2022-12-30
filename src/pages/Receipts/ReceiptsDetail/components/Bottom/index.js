import React, { useState } from 'react';
import style from './index.less';
import { MoreOutline } from 'antd-mobile-icons';
import Audit from '../../../components/Audit';
import MyActionSheet from '../../../../components/MyActionSheet';
import ActionButtons from '../ActionButtons';
import { useRequest } from '../../../../../util/Request';
import { Message } from '../../../../components/Message';
import { MyLoading } from '../../../../components/MyLoading';
import {
  AllocationRevoke,
  InStockRevoke,
  MaintenanceRevoke,
  OutStockRevoke,
  StocktakingRevoke,
} from './components/Revoke';
import { ToolUtil } from '../../../../../util/ToolUtil';
import { ReceiptsEnums } from '../../../index';

const Bottom = (
  {
    version,
    currentNode = [],
    detail = {},
    refresh = () => {
    },
  }) => {

  // 执行审批接口
  const { loading: auditLoading, run: processLogRun } = useRequest(
    {
      url: '/audit/v1.1/post',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Message.successToast('审批完成!', () => {
          refresh();
        });
      },
      onError: () => {
        refresh();
      },
    },
  );

  const actions = [];
  const logIds = [];
  let auditNode = false;
  currentNode.forEach((item) => {
    if (item.stepType === 'audit' && !auditNode) {
      auditNode = true;
    }

    if (!version) {
      const logResult = item.logResult || {};
      logIds.push(logResult.logId);
    } else {
      const logResults = item.logResults || [];
      logResults.map(item => {
        logIds.push(item.logId);
      });
    }

    if (item.auditRule && Array.isArray(item.auditRule.actionStatuses)) {
      return item.auditRule.actionStatuses.map((item) => {
        return actions.push({ action: item.action, id: item.actionId });
      });
    }
  });

  const audit = (status) => {
    processLogRun({
      data: {
        taskId: detail.processTaskId,
        logIds,
        status,
      },
    });
  };

  if (!detail.permissions) {
    return <></>;
  }

  const revoke = () => {
    switch (detail.type) {
      case ReceiptsEnums.instockOrder:
        InStockRevoke(detail);
        break;
      case ReceiptsEnums.outstockOrder:
        OutStockRevoke(detail);
        break;
      case ReceiptsEnums.allocation:
        AllocationRevoke(detail);
        break;
      case ReceiptsEnums.stocktaking:
        StocktakingRevoke(detail);
        break;
      case ReceiptsEnums.maintenance:
        MaintenanceRevoke(detail);
        break;
      default:
        break;
    }
  };

  return <div hidden={!auditNode} className={style.bottom}>
    <ActionButtons
      taskDetail={detail}
      refresh={refresh}
      taskId={detail.processTaskId}
      logIds={logIds}
      createUser={detail.type === ReceiptsEnums.error ? null : detail.createUser}
      permissions={detail.permissions}
      onClick={(action) => {
        switch (action) {
          case 'ok':
            audit(1);
            break;
          case 'no':
            audit(0);
            break;
          case 'revokeAndAsk':
            revoke();
            break;
          default:
            break;
        }
      }}
      actions={[
        { name: '同意', action: 'ok' },
        { name: '驳回', action: 'no' },
      ]}
    />
    {auditLoading && <MyLoading />}

  </div>;
};

export default Bottom;
