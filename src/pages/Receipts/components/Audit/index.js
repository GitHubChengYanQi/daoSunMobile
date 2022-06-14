import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import style from '../../ReceiptsDetail/components/Bottom/index.less';
import { MyLoading } from '../../../components/MyLoading';

const Audit = (
  {
    id,
    refresh,
    mediaIds = [],
    userIds = [],
    note,
  }) => {

  // 执行审批接口
  const { loading, run: processLogRun } = useRequest(
    {
      url: '/audit/post',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Toast.show({
          content: '审批完成！',
          position: 'bottom',
        });
      },
      onError: () => {
        Toast.show({
          content: '审批失败！',
          position: 'bottom',
        });
      },
    },
  );

  const audit = (status) => {
    processLogRun({
      data: {
        taskId: id,
        status,
        userIds: userIds.toString(),
        photoId: mediaIds.toString(),
        note,
      },
    });
  };

  return <>
    <div className={style.buttons}>
      <Button color='primary' fill='none' onClick={() => {
        audit(0);
      }}>
        驳回
      </Button>
      <Button color='primary' onClick={() => {
        audit(1);
      }}>
        同意
      </Button>
    </div>

    {loading && <MyLoading />}
  </>;
};

export default Audit;
