import React, { useState } from 'react';
import StocktaskingHandle
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import { taskList } from '../../../../Work/Inventory/StartStockTaking';
import MyCard from '../../../../components/MyCard';
import { UserName } from '../../../../components/User';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

export const inventoryDetail = { url: '/inventory/detail', method: 'POST' };

const StocktakingLog = (
  {
    inventoryTaskId,
  },
) => {

  const [data, setData] = useState();

  const { loading, data: detail = {} } = useRequest({ ...inventoryDetail, data: { inventoryTaskId } });

  const showStock = detail.method === 'OpenDisc';

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyCard title='盘点明细' bodyStyle={{padding:0}}>
      <StocktaskingHandle
        noTips
        show
        api={taskList}
        params={{ inventoryId: inventoryTaskId }}
        showStock={showStock}
        data={data}
        setData={setData}
      />
    </MyCard>

    <MyCard title='执行人' extra={<UserName user={{ name: detail.handleUserName }} />} />

    <MyCard title='来源' extra={`${detail.createUserName}的${detail.positionId ? '即时盘点' : '盘点任务'} / ${detail.coding}`} />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default StocktakingLog;
