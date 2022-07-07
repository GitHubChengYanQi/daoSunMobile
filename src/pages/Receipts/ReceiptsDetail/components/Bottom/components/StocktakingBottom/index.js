import React from 'react';
import { useRequest } from '../../../../../../../util/Request';
import { Message } from '../../../../../../components/Message';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import style from '../../index.less';
import { Button } from 'antd-mobile';
import { MyLoading } from '../../../../../../components/MyLoading';

export const inventoryComplete = { url: '/inventoryDetail/complete', method: 'POST' };

const StocktakingBottom = (
  {
    detail = {},
    actions = [],
    refresh = () => {
    },
  },
) => {

  const { loading, run } = useRequest(inventoryComplete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！',()=>{
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

  const taskList = ToolUtil.isObject(detail.receipts).taskList || [];
  const stocktakings = taskList.filter((item) => {
    const skuResultList = item.skuResultList || [];
    const complete = skuResultList.filter(item => {
      return item.lockStatus === 98;
    });
    return complete.length !== skuResultList.length;
  });

  return <div hidden={!getAction('check').id} className={style.bottom}>
    <Button
      disabled={stocktakings.length > 0}
      className={style.button}
      color='primary'
      onClick={() => {
        run({ data: { inventoryIds: [detail.formId] } });
      }}>盘点完成</Button>

    {loading && <MyLoading />}
  </div>;
};

export default StocktakingBottom;
