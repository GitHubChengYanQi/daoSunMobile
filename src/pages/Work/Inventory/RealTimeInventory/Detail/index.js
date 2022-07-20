import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { useLocation } from 'react-router-dom';
import StocktaskigAction
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskigAction';
import MyEmpty from '../../../../components/MyEmpty';
import MyNavBar from '../../../../components/MyNavBar';
import { ToolUtil } from '../../../../components/ToolUtil';

export const inventoryPageList = { url: '/inventoryStock/taskList', method: 'POST' };

const Detail = () => {

  const { query } = useLocation();

  const [data, setData] = useState();

  const { loading, run } = useRequest(inventoryPageList, {
    manual: true,
    onSuccess:(res)=>{
      const newData = [];
      res.forEach(item => {
        const newPositionIds = newData.map(item => item.positionId);
        const newPositionIndex = newPositionIds.indexOf(item.positionId);
        if (newPositionIndex !== -1) {
          const newPosition = newData[newPositionIndex];
          newData[newPositionIndex] = { ...newPosition, skuResultList: [...newPosition.skuResultList, item] };
        } else {
          newData.push({
            positionId: item.positionId,
            name: ToolUtil.isObject(item.positionsResult).name,
            storehouseResult: ToolUtil.isObject(item.positionsResult).storehouseResult,
            skuResultList: [item],
          });
        }
      });
      setData(newData);
    }
  });

  useEffect(() => {
    if (query.inventoryTaskId) {
      run({ data: { inventoryId: query.inventoryTaskId } });
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title='盘点详情' />
    <StocktaskigAction
      data={data}
      showStock
      show
    />
  </>;
};

export default Detail;
