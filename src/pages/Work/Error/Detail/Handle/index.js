import React from 'react';
import SkuError
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockError/components/SkuError';
import { useLocation } from 'umi';
import MyEmpty from '../../../../components/MyEmpty';

const Handle = () => {

  const { query } = useLocation();

  if (!(query && query.id)) {
    return <MyEmpty />;
  }

  return <>
    <SkuError anomalyId={query.id} />
  </>;
};

export default Handle;
