import React from 'react';
import MyNavBar from '../../../components/MyNavBar';
import Task from '../../Stock/Task';
import { ReceiptsEnums } from '../../../Receipts';
import { ToolUtil } from '../../../../util/ToolUtil';

const Orderlist = () => {

  return <>
    <MyNavBar title='入库单列表' />
    <Task activeKey={ReceiptsEnums.instockOrder} top={ToolUtil.isQiyeWeixin() ? 0 : 45} />
  </>;
};

export default Orderlist;
