import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less';
import MyList from '../../components/MyList';
import OutStockItem from '../Stock/Task/components/OutStockTask/components/OutStockItem';
import { ReceiptsEnums } from '../../Receipts';
import { useModel } from 'umi';

const list = { url: '/productionPickLists/selfPickTasks', method: 'POST' };

const MyPicking = () => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};


  const [data, setData] = useState([]);

  return <div className={style.myPicking}>
    <MyNavBar title='领料中心' />
    <MyList
      api={list}
      data={data}
      getData={setData}
      params={{ auditType: 'audit', statusList: ['0'], type: ReceiptsEnums.outstockOrder, userId: userInfo.id }}
    >
      {
        data.map((item, index) => {
          return <div key={index}>
            <OutStockItem item={item} index={index} />
          </div>;
        })
      }
    </MyList>
  </div>;

};

export default MyPicking;
