import React, { useState } from 'react';
import { Badge, FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import Icon from '../../../../../../../../components/Icon';
import WaitOutSku from './WaitOutSku';

const OutStockShop = (
  {
    id,
    refresh = () => {
    },
    allPerpareNumber = 0,
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
            <Badge
              content={allPerpareNumber || null}
              style={{ '--right': '5%', '--top': '5%' }}>
              <Icon type='icon-chukuguanli2' />
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
      destroyOnClose
      visible={visible}
    >
      <WaitOutSku id={id} refresh={() => setRefreshOrder(true)} />
    </Popup>
  </div>;
};

export default OutStockShop;
