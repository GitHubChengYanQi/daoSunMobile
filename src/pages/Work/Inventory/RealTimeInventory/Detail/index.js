import React, { useEffect } from 'react';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { useLocation } from 'react-router-dom';
import StocktaskigAction
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskigAction';
import MyEmpty from '../../../../components/MyEmpty';
import MyNavBar from '../../../../components/MyNavBar';

export const inventoryPageList = { url: '/inventoryStock/taskList', method: 'POST' };

const Detail = () => {

  const { query } = useLocation();

  const { loading, data, run } = useRequest(inventoryPageList, { manual: true });

  useEffect(() => {
    if (query.inventoryTaskId) {
      run({ data: { inventoryId: query.inventoryTaskId } });
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data){
    return <MyEmpty />
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
