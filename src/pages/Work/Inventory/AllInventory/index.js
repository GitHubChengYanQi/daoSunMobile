import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import StocktaskingHandle
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import { MyLoading } from '../../../components/MyLoading';
import {
  inventoryAddPhoto, inventoryComplete,
  temporaryLock,
} from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking';
import MyNavBar from '../../../components/MyNavBar';
import { Message } from '../../../components/Message';
import { useHistory } from 'react-router-dom';
import MyEmpty from '../../../components/MyEmpty';

export const allInventory = { url: '/inventoryDetail/mergeDetail', method: 'GET' };

const AllInventory = () => {

  const history = useHistory();

  const [data, setData] = useState([]);
  const [ids, setIds] = useState([]);

  const { loading } = useRequest(allInventory, {
    onSuccess: (res) => {
      setData(res.List || []);
      setIds(res.ids || []);
    },
  });

  const { loading: completeLoading, run: compltetRun } = useRequest(inventoryComplete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        history.goBack();
      });
    },
  });

  const { loading: temporaryLockLoading, run: temporaryLockRun } = useRequest(temporaryLock, {
    manual: true,
  });

  const { run: addPhoto } = useRequest(inventoryAddPhoto, { manual: true });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title='合并盘点' />
    <StocktaskingHandle
      anomalyType='allStocktaking'
      temporaryLockRun={(data) => temporaryLockRun({ data })}
      actionPermissions
      addPhoto={(data) => addPhoto({ data })}
      showStock
      setData={setData}
      complete={() => {
        compltetRun({ data: { inventoryIds: ids } });
      }}
      data={data}
    />

    {(temporaryLockLoading || completeLoading) && <MyLoading />}
  </>;
};

export default AllInventory;
