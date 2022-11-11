import React, { useState } from 'react';
import MyEmpty from '../../../../components/MyEmpty';
import { Space } from 'antd-mobile';
import styles from '../../index.less';
import { history } from 'umi';
import MyCard from '../../../../components/MyCard';
import MyProgress from '../../../../components/MyProgress';
import LinkButton from '../../../../components/LinkButton';
import MyAntPopup from '../../../../components/MyAntPopup';
import SkuItem from '../../../Sku/SkuItem';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import { isArray } from '../../../../components/ToolUtil';

const ShipList = ({ data }) => {

  const [visible, setVisible] = useState();

  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <div className={styles.mainDiv}>
    {
      data.map((item, index) => {
        const setpSetResult = item.setpSetResult || {};
        const shipSetpResult = setpSetResult.shipSetpResult || {};

        return <div key={index}>
          <MyCard
            key={index}
            className={styles.card}
            bodyClassName={styles.cardBody}
            title={shipSetpResult.shipSetpName}
          >
            <div className={styles.bodyCard}>
              <Space direction='vertical' align='center' style={{ flexGrow: 1 }}>
                <div>
                  任务总数
                </div>
                <div>
                  {item.cardNumber}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: '#f38403' }}>
                <div>
                  已申请
                </div>
                <div>
                  {item.toDoNum}
                </div>
              </Space>
            </div>
            <div className={styles.buttons}>
              <LinkButton
                disabled={number <= 0}
                className={styles.dispatch}
                onClick={() => {
                  history.push(`/Work/Production/CreateTask?id=${item.workOrderId}&max=${(item.cardNumber || 0) - (item.toDoNum || 0)}&shipName=${shipSetpResult.shipSetpName}`);
                }}
              >
                申请出库
              </LinkButton>
            </div>
          </MyCard>
        </div>;
      })
    }

    <MyAntPopup
      onClose={() => setVisible('')}
      title='产出物料'
      visible={visible}
    >
      <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
        {
          isArray(visible).map((skuItem, index) => {
            return <div key={index} className={styles.skuItem}>
              <SkuItem extraWidth='80px' className={styles.sku} skuResult={skuItem.skuResult} />
              <ShopNumber show value={skuItem.num} />
            </div>;
          })
        }
      </div>
    </MyAntPopup>

  </div>;
};

export default ShipList;
