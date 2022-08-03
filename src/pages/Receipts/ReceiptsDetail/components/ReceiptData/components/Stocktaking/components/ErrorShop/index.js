import React, { useState } from 'react';
import { Badge, FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import InstockError from '../../../InstockOrder/components/InstockShop/components/InstockError';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import instockErrorShop from '../../../../../../../../../assets/instockErrorShop.png';
import Bouncing from '../../../../../../../../components/Bouncing';

const ErrorShop = (
  {
    showStock,
    anomalyType,
    errorNumber,
    id,
    refresh = () => {
    },
    onChange = () => {
    },
    errorReturn = () => {
    },
    errorShopRef,
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
          showStock={showStock}
          noBack
          anomalyType={anomalyType}
          formId={id}
          refresh={(data, status) => {
            errorReturn(data, status);
            setRefreshOrder(true);
          }}
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
          showStock={showStock}
          noDelete
          type={ReceiptsEnums.stocktaking}
          id={params.id}
          onClose={(deleteAction) => {
            if (deleteAction && (params.remainingQuantity === 1)) {
              id && refresh();
              setVisible(false);
            } else {
              setType('stockTaskingErrror');
            }
          }}
          refreshOrder={(data) => {
            setRefreshOrder(true);
            !id && onChange(data);
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
      <div id='stocktakingError' className={style.actions}>
        <div className={style.action} onClick={() => {
          setType('stockTaskingErrror');
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Badge
              content={errorNumber || null}
              style={{ '--right': '5%', '--top': '5%' }}>
              <Bouncing ref={errorShopRef} size={24} img={instockErrorShop} />
            </Badge></div>
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
      destroyOnClose
    >
      {content()}
    </Popup>

  </>;
};

export default ErrorShop;
