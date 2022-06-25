import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Button, Space } from 'antd-mobile';
import MyBottom from '../../../components/MyBottom';
import CreateInStock from '../../ProcessTask/Create/components/CreateInStock';
import Task from '../../Stock/Task';
import { ReceiptsEnums } from '../../../Receipts';
import { ToolUtil } from '../../../components/ToolUtil';

const Orderlist = () => {


  const [visible, setVisible] = useState();


  return <>
    <MyNavBar title='入库单列表' />
    <MyBottom
      buttons={<Space>
        <Button color='primary' onClick={() => {
          setVisible(true);
        }}>新建入库申请</Button>
      </Space>}
    >
      <Task activeKey={ReceiptsEnums.instockOrder} top={ToolUtil.isQiyeWeixin() ? 0 : 45} />
    </MyBottom>

    <CreateInStock open={visible} onClose={() => setVisible(false)} />
  </>;
};

export default Orderlist;
