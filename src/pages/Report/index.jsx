import React, { useState } from 'react';
import style from './index.less';
import { useHistory } from 'react-router-dom';
import { Tabs } from 'antd-mobile';
import MyCard from '../components/MyCard';
import Stock from './components/Stock';
import MyNavBar from '../components/MyNavBar';
import InOutStock from './InOutStock';

const Report = () => {

  const history = useHistory();

  const [key, setKey] = useState('inOutStock');

  return <div className={style.report}>
    <MyNavBar noDom title='数据统计' />
    <Tabs className={style.tabs} stretch={false} activeKey={key} onChange={setKey}>
      <Tabs.Tab title='库存统计' key='stock'>
        <MyCard className={style.card} titleBom='物料统计' extra={<>历史库存：2022年07月26日 ></>}>
          <Stock />
        </MyCard>
      </Tabs.Tab>
      <Tabs.Tab title='任务统计' key='task'>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
      <Tabs.Tab title='单据统计' key='order'>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
      <Tabs.Tab title='异常分析' key='error'>
        <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 4 }}>
          库存统计
        </div>
      </Tabs.Tab>
      <Tabs.Tab title='出入库统计' key='inOutStock'>
        <InOutStock />
      </Tabs.Tab>
    </Tabs>
  </div>;
};

export default Report;
