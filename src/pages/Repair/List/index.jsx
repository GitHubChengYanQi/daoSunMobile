import React, { useState } from 'react';
import RepairTable from './repairTable';
import MyRepairTable from './MyRepairTable';
import RepairOrder from './RepairOrder';
import { Skeleton, TabPanel, Tabs } from 'weui-react-v2';
import style from './index.css';

const List = () => {

  const [tabKey, setTabKey] = useState('0');

  return (
    <Tabs style={{ backgroundColor: '#fff' }} className={style.tab} onChange={(value) => {
      setTabKey(value);
    }}>
      <TabPanel tabKey='0' tab='我的报修'>
        {tabKey === '0' ? <MyRepairTable select={tabKey} /> : <Skeleton loading />}
      </TabPanel>
      <TabPanel tabKey='1' tab='派给我的工单'>
        {tabKey === '1' ? <RepairTable select={tabKey} /> : <Skeleton loading />}
      </TabPanel>
      <TabPanel tabKey='2' tab='待派工单'>
        {tabKey === '2' ? <RepairOrder select={tabKey} /> : <Skeleton loading />}
      </TabPanel>
    </Tabs>
  );
};

export default List;
