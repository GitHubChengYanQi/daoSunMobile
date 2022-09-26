import React from 'react';
import { Button } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import style from '../../ReceiptsDetail/components/Bottom/index.less';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import { Message } from '../../../components/Message';

const Audit = (
  {
    version,
    id,
    refresh,
    mediaIds = [],
    userIds = [],
    note,
    currentNode = [],
    loading,
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

  const logIds = [];
  currentNode.forEach(item => {
    if (version) {
      const logResult = item.logResult || {};
      logIds.push(logResult.logId);
      return;
    }
    const logResults = item.logResults || [];
    logResults.map(item => {
      logIds.push(item.logId);
    });
  });

  const audit = (status) => {
    processLogRun({
      data: {
        taskId: id,
        logIds,
        status,
        userIds: userIds.toString(),
        photoId: mediaIds.toString(),
        note,
      },
    });
  };

  return <>
    <div className={style.buttons}>
      <Button disabled={loading} className={style.reject} color='primary' fill='outline' onClick={() => {
        audit(0);
      }}>
        驳回
      </Button>
      <Button disabled={loading} color='primary' onClick={() => {
        audit(1);
      }}>
        同意
      </Button>
    </div>

    {auditLoading && <MyLoading />}
  </>;
};

export default Audit;
