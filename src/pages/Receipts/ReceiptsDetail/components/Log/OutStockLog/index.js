import React, { useEffect } from 'react';
import MyEmpty from '../../../../../components/MyEmpty';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';

export const logList = { url: '/instockLogDetail/getOutStockLogs', method: 'POST' };

const OutStockLog = (
  {
    outstockOrderId,
  },
) => {

  const { loading, data, run } = useRequest(logList, { manual: true });
  console.log(data);

  useEffect(() => {
    if (outstockOrderId) {
      run({data: { sourceId: outstockOrderId },});
    }
  }, []);

  // const [data, setData] = useState([]);

  if (loading){
    return <MyLoading skeleton />
  }

  if (!outstockOrderId) {
    return <MyEmpty />;
  }

  return <>

  </>;
};

export default OutStockLog;
