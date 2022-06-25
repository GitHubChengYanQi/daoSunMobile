import React from 'react';
import { Button, Space } from 'antd-mobile';
import MyNavBar from '../../../components/MyNavBar';
import { ReceiptsEnums } from '../../../Receipts';
import MyBottom from '../../../components/MyBottom';
import Task from '../../Stock/Task';
import { ToolUtil } from '../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';


const PickLists = (props) => {

  const history = useHistory();

  return <>
    <MyNavBar title='出库单列表' />
    <MyBottom
      buttons={<Space>
        <Button color='primary' onClick={() => {
          history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.outstockOrder}`);
        }}>新建出库申请</Button>
      </Space>}
    >
      <Task activeKey={ReceiptsEnums.outstockOrder} top={ToolUtil.isQiyeWeixin() ? 0 : 45} />
    </MyBottom>
  </>;
};

export default PickLists;
