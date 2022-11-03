import React, { useState } from 'react';
import { Badge, FloatingBubble, Popup } from 'antd-mobile';
import style from './index.less';
import WaitInstock from './components/WaitInstock';
import OneInStock from './components/OneInStock';
import InstockError from './components/InstockError';
import Error from '../Error';
import { ReceiptsEnums } from '../../../../../../../index';
import Bouncing from '../../../../../../../../components/Bouncing';

import waitInstockShop from '../../../../../../../../../assets/waitInstockShop.png';
import instockErrorShop from '../../../../../../../../../assets/instockErrorShop.png';

const InstockShop = (
  {
    actionId,
    id,
    refresh = () => {
    },
    waitShopRef,
    errorShopRef,
    order = {},
  }) => {


  const [visible, setVisible] = useState();

  const [refreshOrder, setRefreshOrder] = useState();

  const [type, setType] = useState();

  const [params, setParams] = useState({});

  const content = () => {
    switch (type) {
      case 'waitInStock':
        return <WaitInstock
          refresh={() => setRefreshOrder(true)}
          actionId={actionId}
          instockOrderId={id}
          onClose={() => {
            if (refreshOrder) {
              setRefreshOrder(false);
              refresh();
            }
            setVisible(false);
          }}
          onInstock={(item, remainingQuantity) => {

            // 单个入库
            setType('oneInStock');
            setParams({ item, remainingQuantity });
          }} />;
      case 'oneInStock':
        return <OneInStock
          refresh={() => setRefreshOrder(true)}
          actionId={actionId}
          instockOrderId={id}
          skuItem={params.item}
          onClose={(complete) => {
            if (complete && (params.remainingQuantity === 1)) {
              refresh();
              setVisible(false);
            } else {
              setType('waitInStock');
            }
          }} />;
      case 'instockError':
        return <InstockError
          type={ReceiptsEnums.instockOrder}
          formId={id}
          refresh={() => setRefreshOrder(true)}
          onClose={() => {
            if (refreshOrder) {
              setRefreshOrder(false);
              refresh();
            }
            setVisible(false);
          }}
          onEdit={(id, remainingQuantity) => {

            // 修改入库异常
            setType('error');
            setParams({ id, remainingQuantity });
          }}
        />;
      case 'error':
        return <Error
          type={ReceiptsEnums.instockOrder}
          id={params.id}
          onClose={(deleteAction) => {
            if (deleteAction && (params.remainingQuantity === 1)) {
              refresh();
              setVisible(false);
            } else {
              setType('instockError');
            }
          }}
          refreshOrder={() => {
            setRefreshOrder(true);
          }}
        />;
      default:
        return <></>;
    }
  };


  return <div>
    <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '84px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }}
      className={style.float}
    >
      <div className={style.actions}>
        <div id='waitInstock' className={style.action} onClick={() => {
          setType('waitInStock');
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Bouncing ref={waitShopRef} size={24} img={waitInstockShop} number={order.waitInStockNum} />
          </div>
        </div>
        <div id='instockError' className={style.action} onClick={() => {
          setType('instockError');
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Bouncing ref={errorShopRef} size={24} img={instockErrorShop} number={order.instockErrorNum} />
          </div>
        </div>
      </div>
    </FloatingBubble>


     <Popup
      getContainer={null}
      destroyOnClose
      onMaskClick={() => {
        if (refreshOrder) {
          setRefreshOrder(false);
          refresh();
        }
        setVisible(false);
      }}
      mask
      visible={visible}
    >
      {content()}
    </Popup>
  </div>;
};

export default InstockShop;
