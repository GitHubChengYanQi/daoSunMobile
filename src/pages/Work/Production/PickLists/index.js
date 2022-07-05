import React from 'react';
import { ReceiptsEnums } from '../../../Receipts';
import Task from '../../Stock/Task';
import { ToolUtil } from '../../../components/ToolUtil';
import MyNavBar from '../../../components/MyNavBar';


const PickLists = (props) => {
  return <>
    <MyNavBar title='出库单列表' />
    <Task activeKey={ReceiptsEnums.outstockOrder} top={ToolUtil.isQiyeWeixin() ? 0 : 45} />
  </>;
};

export default PickLists;
