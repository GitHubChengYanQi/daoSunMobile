import React, { useEffect, useState } from 'react';
import StocktaskigAction from './components/StocktaskigAction';
import { useRequest } from '../../../../../../../util/Request';
import { MyLoading } from '../../../../../../components/MyLoading';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };

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

  const { loading: temporaryLockLoading, run: temporaryLockRun } = useRequest(temporaryLock, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  const { run: addPhoto } = useRequest(inventoryAddPhoto, { manual: true });

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  return <>
    <StocktaskigAction
      data={data}
      setData={setData}
      inventoryTaskId={receipts.inventoryTaskId}
      refresh={refresh}
      actionPermissions={actionPermissions}
      showStock={showStock}
      temporaryLockRun={(data) => {
        temporaryLockRun({ data });
      }}
      addPhoto={(data) => {
        addPhoto(data);
      }}
    />

    {temporaryLockLoading && <MyLoading />}
  </>;


};

export default Stocktaking;
