import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';
import { Message } from '../../../../../../components/Message';
import StocktaskingHandle from './components/StocktaskingHandle';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };
export const inventoryComplete = { url: '/inventoryDetail/complete', method: 'POST' };

const Stocktaking = (
  {
    permissions,
    receipts = {},
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('check').id && permissions;

  const [data, setData] = useState([]);

  const showStock = receipts.method !== 'DarkDisk';

  const { loading, run } = useRequest(inventoryComplete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        refresh();
      });
    },
  });

  const { loading: temporaryLockLoading, run: temporaryLockRun } = useRequest(temporaryLock, {
    manual: true,
  });

  const { run: addPhoto } = useRequest(inventoryAddPhoto, { manual: true });

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  return <>
    <StocktaskingHandle
      anomalyType='StocktakingError'
      temporaryLockRun={(data) => temporaryLockRun({ data })}
      actionPermissions={actionPermissions}
      addPhoto={(data) => addPhoto({ data })}
      showStock={showStock}
      inventoryTaskId={receipts.inventoryTaskId}
      setData={setData}
      complete={() => {
        run({ data: { inventoryIds: [receipts.inventoryTaskId] } });
      }}
      data={data}
    />

    {(temporaryLockLoading || loading) && <MyLoading />}
  </>;


};

export default Stocktaking;
