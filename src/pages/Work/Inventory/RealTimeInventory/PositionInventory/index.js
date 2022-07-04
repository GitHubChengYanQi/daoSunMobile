import React from 'react';
import { useRequest } from '../../../../../util/Request';

export const positionInventory = { url: '/inventory/timely', method: 'POST' };

const PositionInventory = () => {

  const { run } = useRequest(positionInventory, { manual: true });

  return <></>;


};

export default PositionInventory;
