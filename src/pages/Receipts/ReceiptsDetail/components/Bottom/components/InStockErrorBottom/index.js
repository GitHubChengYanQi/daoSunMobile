import React from 'react';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';
import { Message } from '../../../../../../components/Message';
import BottomButton from '../../../../../../components/BottomButton';

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
  });

  const getAction = (action) => {
    const actionData = actions.filter(item => {
      return item.action === action;
    });
    return actionData[0] || {};
  };


  const anomalyResults = ToolUtil.isObject(detail.receipts).anomalyResults || [];
  const complete = anomalyResults.filter(item => item.status === 99);
  return <div hidden={!getAction('verify').id}>
    <BottomButton
      only
      text='提交处理'
      disabled={complete.length !== anomalyResults.length}
      onClick={() => {
        run({ data: { orderId: detail.formId, actionId: getAction('verify').id } });
      }} />

    {loading && <MyLoading />}
  </div>;
};

export default InStockErrorBottom;
