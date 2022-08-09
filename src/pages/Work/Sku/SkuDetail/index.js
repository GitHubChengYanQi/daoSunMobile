import React, { useEffect } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';

const SkuDetail = ({ skuId }) => {

  const { loading, data, run } = useRequest(skuDetail, { manual: true });
  console.log(data);

  useEffect(() => {
    if (skuId) {
      run({ data: { run } });
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <>

  </>;
};

export default SkuDetail;
