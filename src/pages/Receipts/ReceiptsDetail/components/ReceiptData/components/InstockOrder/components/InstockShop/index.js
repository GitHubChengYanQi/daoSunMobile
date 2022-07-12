import React, { useState } from 'react';
import { Badge, FloatingBubble, Popup } from 'antd-mobile';
import style from './index.less';
import Icon from '../../../../../../../../components/Icon';
import WaitInstock from './components/WaitInstock';
import OneInStock from './components/OneInStock';
import InstockError from './components/InstockError';
import Error from '../Error';
import { ReceiptsEnums } from '../../../../../../../index';

const InstockShop = (
  {
    actionId,
    id,
    refresh = () => {
    },
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
        '--initial-position-bottom': '24px',
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
            <Badge
              content={order.waitInStockNum || null}
              style={{ '--right': '5%', '--top': '5%' }}>
              <Icon type='icon-dairukuang' /></Badge>
          </div>
        </div>
        <div id='instockError' className={style.action} onClick={() => {
          setType('instockError');
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Badge
              content={order.instockErrorNum || null}
              style={{ '--right': '5%', '--top': '5%' }}>
              <Icon type='icon-yichangkuang' />
            </Badge>
          </div>
        </div>
      </div>
    </FloatingBubble>


    <Popup
      onMaskClick={() => {
        if (refreshOrder) {
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
