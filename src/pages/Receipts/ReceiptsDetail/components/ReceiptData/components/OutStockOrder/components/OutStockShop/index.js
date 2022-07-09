import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import Icon from '../../../../../../../../components/Icon';
import WaitOutSku from './WaitOutSku';

const OutStockShop = (
  {
    actionId,
    id,
    refresh = () => {
    },
  }) => {


  const [visible, setVisible] = useState();

  const [refreshOrder, setRefreshOrder] = useState();

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
        <div className={style.action} onClick={() => {
          setVisible(true);
        }}>
          <div className={style.actionButton}><Icon type='icon-chukuguanli2' /></div>
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
      destroyOnClose
      visible={visible}
    >
      <WaitOutSku id={id} refresh={() => setRefreshOrder(true)} />
    </Popup>
  </div>;
};

export default OutStockShop;
