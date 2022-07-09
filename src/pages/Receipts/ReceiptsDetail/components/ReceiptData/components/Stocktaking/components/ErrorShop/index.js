import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import InstockError from '../../../InstockOrder/components/InstockShop/components/InstockError';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import Icon from '../../../../../../../../components/Icon';

const ErrorShop = (
  {
    id,
    refresh = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const [type, setType] = useState();

  const [params, setParams] = useState();

  const [refreshOrder, setRefreshOrder] = useState();

  const content = () => {
    switch (type) {
      case 'stockTaskingErrror':
        return <InstockError
          formId={id}
          refresh={() => setRefreshOrder(true)}
          type={ReceiptsEnums.stocktaking}
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
          type={ReceiptsEnums.stocktaking}
          id={params.id}
          onClose={(deleteAction) => {
            if (deleteAction && (params.remainingQuantity === 1)) {
              if (refreshOrder) {
                refresh();
              }
              setVisible(false);
            } else {
              setType('stockTaskingErrror');
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


  return <>

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
        <div className={style.action} onClick={() => {
          setType('stockTaskingErrror');
          setVisible(true);
        }}>
          <div className={style.actionButton}><Icon type='icon-yichangkuang' /></div>
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

  </>;
};

export default ErrorShop;
