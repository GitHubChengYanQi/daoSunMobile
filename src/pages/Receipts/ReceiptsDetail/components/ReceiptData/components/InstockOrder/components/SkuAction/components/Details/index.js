import React, { useEffect } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { instockHandle } from '../../index';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import InSkuItem from '../InSkuItem';

const Details = (
  { instockOrderId },
) => {

  const { loading, data, run } = useRequest(instockHandle, {
    manual: true,
  });

  useEffect(() => {
    run({ data: { instockOrderId } });
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty description='暂无入库详情数据' />;
  }

  return <>
    {data.map((item,index)=>{
      return <div key={index}>
        <InSkuItem detail item={item} key={index} />
      </div>
    })}
  </>;
};

export default Details;
