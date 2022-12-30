import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MyBottom from '../../../components/MyBottom';
import { Button, Space } from 'antd-mobile';
import { ReceiptsEnums } from '../../../Receipts';
import Task from '../../Stock/Task';
import { ToolUtil } from '../../../../util/ToolUtil';
import Inventory from '../../ProcessTask/Create/components/Inventory';
import { useHistory } from 'react-router-dom';

const InventoryList = () => {

  const history = useHistory();

  const [visible, setVisible] = useState();

  return <>
    <MyNavBar title='出库单列表' />
    <MyBottom
      buttons={<Space>
        <Button onClick={() => {
          history.push('/Work/Inventory/RealTimeInventory');
        }}>即时盘点</Button>
        <Button color='primary' fill='outline'>开始盘点</Button>
        <Button color='primary' onClick={() => {
          setVisible(true);
        }}>新建盘点申请</Button>
      </Space>}
    >
      <Task activeKey={ReceiptsEnums.stocktaking} top={ToolUtil.isQiyeWeixin() ? 0 : 45} />
    </MyBottom>

    <Inventory open={visible} onClose={() => setVisible(false)} />
  </>;
};

export default InventoryList;
