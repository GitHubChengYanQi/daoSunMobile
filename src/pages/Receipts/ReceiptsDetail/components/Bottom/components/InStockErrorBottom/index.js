import React from 'react';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import style from '../../index.less';
import { Button } from 'antd-mobile';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';
import { Message } from '../../../../../../components/Message';

export const submit = { url: '/anomalyOrder/submit', method: 'POST' };

const InStockErrorBottom = (
  {
    detail = {},
    actions = [],
    refresh = () => {
    },
  },
) => {

  const { loading, run } = useRequest(submit, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        refresh();
      });
    },
    onError: () => {
      Message.errorToast('提交失败！');
    },
  });

  const getAction = (action) => {
    const actionData = actions.filter(item => {
      return item.action === action;
    });
    return actionData[0] || {};
  };


  const anomalyResults = ToolUtil.isObject(detail.receipts).anomalyResults || [];
  const complete = anomalyResults.filter(item => item.status === 99);
  return <div hidden={!getAction('verify').id} className={style.bottom}>
    <Button
      disabled={complete.length !== anomalyResults.length}
      className={style.button}
      color='primary'
      onClick={() => {
        run({ data: { orderId: detail.formId, actionId: getAction('verify').id } });
      }}>提交处理</Button>

    {loading && <MyLoading />}
  </div>;
};

export default InStockErrorBottom;
