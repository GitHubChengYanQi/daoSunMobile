import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import style from '../../ReceiptsDetail/components/Bottom/index.less';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import { Message } from '../../../components/Message';

const Audit = (
  {
    id,
    refresh,
    mediaIds = [],
    userIds = [],
    note,
    currentNode = [],
    loading,
  }) => {

  // 执行审批接口
  const { loading:auditLoading, run: processLogRun } = useRequest(
    {
      url: '/audit/post',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Message.successToast('审批完成!',()=>{
          refresh();
        })
      },
      onError: () => {
        Message.errorToast('审批失败!',()=>{
          refresh();
        })
      },
    },
  );

  const audit = (status) => {
    processLogRun({
      data: {
        taskId: id,
        logIds: currentNode.map(item => {
          return ToolUtil.isObject(item.logResult).logId;
        }),
        status,
        userIds: userIds.toString(),
        photoId: mediaIds.toString(),
        note,
      },
    });
  };

  return <>
    <div className={style.buttons}>
      <Button disabled={loading} color='primary' fill='none' onClick={() => {
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
