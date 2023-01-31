import React, { useRef } from 'react';
import { Tabs } from 'antd-mobile';
import MyNavBar from '../../../components/MyNavBar';
import BatchPrepare, { outDetail } from '../BatchPrepare';
import OutStockShop
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutStockShop';
import { useLocation } from 'react-router-dom';
import OnePrepare from '../OnePrepare';
import { MyLoading } from '../../../components/MyLoading';
import { useRequest } from '../../../../util/Request';
import styles from './index.less';

const Prepare = () => {

  const { query } = useLocation();

  const action = query.action === 'true';

  const shopRef = useRef();
  const batchPrepareRef = useRef();
  const onePrepareRef = useRef();

  const { loading: outDetailLoading, data: detail = {} } = useRequest({
    ...outDetail,
    data: { pickListsId: query.pickListsId },
  });

  if (outDetailLoading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='出库明细' />

    <div className={styles.tab}>
      <Tabs>
        <Tabs.Tab title='一键备料' key='batch' destroyOnClose>
          <BatchPrepare
            shopRef={shopRef}
            ref={batchPrepareRef}
            detail={detail}
            taskId={query.taskId}
            action={query.action === 'true'}
            pickListsId={query.pickListsId}
            theme={query.theme}
          />
        </Tabs.Tab>
        <Tabs.Tab title='单独备料' key='one' destroyOnClose>
          <OnePrepare
            shopRef={shopRef}
            ref={onePrepareRef}
            positionIds={detail.positionIds}
            taskId={query.taskId}
            action={query.action === 'true'}
            pickListsId={query.pickListsId}
            theme={query.theme}
          />
        </Tabs.Tab>
      </Tabs>
    </div>


    {action && <OutStockShop
      shopRef={shopRef}
      taskId={query.taskId}
      outType={query.source}
      id={query.pickListsId}
      refresh={() => {
        batchPrepareRef.current?.refresh();
        onePrepareRef.current?.refresh();
      }}
    />}
  </>;
};

export default Prepare;
