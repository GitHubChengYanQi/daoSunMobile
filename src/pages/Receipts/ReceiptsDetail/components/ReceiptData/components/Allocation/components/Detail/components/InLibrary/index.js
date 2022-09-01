import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import InSkuItem from '../../../../../InstockOrder/components/SkuAction/components/InSkuItem';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';

export const getInstock = { url: '/allocation/getInstockListResultsByAllocationTask', method: 'GET' };

const InLibrary = (
  {
    taskId,
  },
) => {

  const [data, setData] = useState([]);

  const { loading, run } = useRequest(getInstock, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  useEffect(() => {
    if (taskId) {
      run({ params: { taskId } });
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty description='暂无调入明细' />;
  }

  return <>
    {
      data.map((item, index) => {
        return <InSkuItem item={item} other key={index} />;
      })
    }
  </>;
};

export default InLibrary;
