import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import WaitOutSku from './WaitOutSku';
import waitInstockShop from '../../../../../../../../../assets/waitInstockShop.png';
import Bouncing from '../../../../../../../../components/Bouncing';

const OutStockShop = (
  {
    outType,
    id,
    taskId,
    refresh = () => {
    },
    allPerpareNumber = 0,
    shopRef,
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
      <div id='pickShop' className={style.actions}>
        <div className={style.action} onClick={() => {
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Bouncing ref={shopRef} size={24} img={waitInstockShop} number={allPerpareNumber} />
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
      destroyOnClose
      visible={visible}
    >
      <WaitOutSku taskId={taskId} outType={outType} id={id} refresh={() => setRefreshOrder(true)} />
    </Popup>
  </div>;
};

export default OutStockShop;
