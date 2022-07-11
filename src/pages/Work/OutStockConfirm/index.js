import React, { useEffect } from 'react';
import MyNavBar from '../../components/MyNavBar';
import { useLocation } from 'react-router-dom';
import MySearch from '../../components/MySearch';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import MyEmpty from '../../components/MyEmpty';

const listByCode = { url: '/productionPickLists/listByCode', method: 'GET' };

const OutStockConfirm = () => {

  const { query } = useLocation();

  const { loading, data, run } = useRequest(listByCode, { manual: true });
  console.log(data);

  useEffect(() => {
    if (query.code) {
      run(query.code);
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  if (!query.code) {
    return <>
      <MyNavBar title='出库确认' />
      <MySearch placeholder='请输入领料码' style={{ width: '100%' }} />
      <MyEmpty description='努力开发中...' />
    </>;
  }

  return <>
    <MyNavBar title='出库确认' />
    <MyEmpty description='努力开发中...' />
  </>;
};

export default OutStockConfirm;
