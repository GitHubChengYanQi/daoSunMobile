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

        }}>
          <div className={style.actionButton}>单据</div>
          <span className={style.text} />
        </div>
        <div className={style.action} onClick={() => {
          setVisible(true);
        }}>
          <div className={style.actionButton}><Icon type='icon-chukuguanli2' /></div>
          <span className={style.text}>待出</span>
        </div>
      </div>
    </FloatingBubble>


    <Popup
      onMaskClick={() => {
        setVisible(false);
      }}
      mask
      visible={visible}
    >
      <WaitOutSku />
    </Popup>
  </div>;
};

export default OutStockShop;
