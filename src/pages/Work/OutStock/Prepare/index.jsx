import React, { useRef } from 'react';
import { Tabs } from 'antd-mobile';
import MyNavBar from '../../../components/MyNavBar';
import BatchPrepare from '../BatchPrepare';
import OutStockShop
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutStockShop';
import { useLocation } from 'react-router-dom';

const Prepare = () => {

  const { query } = useLocation();

  const action = query.action === 'true';

  const shopRef = useRef();

  return <>
    <MyNavBar title='物出库明细' />
    <Tabs>
      <Tabs.Tab title='一键备料' key='batch'>
        <BatchPrepare />
      </Tabs.Tab>
      <Tabs.Tab title='单独备料' key='one'>

      </Tabs.Tab>
    </Tabs>


    {action && <OutStockShop
      shopRef={shopRef}
      taskId={query.taskId}
      outType={query.source}
      id={query.pickListsId}
      // refresh={refresh}
    />}
  </>;
};

export default Prepare;
