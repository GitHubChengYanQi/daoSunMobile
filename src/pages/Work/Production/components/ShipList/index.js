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
        const productionStation = setpSetResult.productionStation || {};
        const setpSetDetails = setpSetResult.setpSetDetails || [];

        return <div key={index}>
          <MyCard
            key={index}
            className={styles.card}
            bodyClassName={styles.cardBody}
            title={shipSetpResult.shipSetpName}
            extra={`工位：${productionStation.name || '-'}`}
          >
            <div className={styles.bodyCard}>
              <Space direction='vertical' align='center' style={{ flexGrow: 1 }}>
                <div>
                  卡片数
                </div>
                <div>
                  {item.cardNumber}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: '#9A9A9A' }}>
                <div>
                  子卡片数
                </div>
                <div>
                  {item.count}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1,color: '#f38403' }}>
                <div>
                  进行中
                </div>
                <div>
                  {item.toDoNum}
                </div>
              </Space>
              <Space direction='vertical' align='center' style={{ flexGrow: 1, color: 'green' }}>
                <div>
                  已完成
                </div>
                <div>
                  {item.completeNum}
                </div>
              </Space>
            </div>
            <div className={styles.process}>
              <MyProgress percent={(item.completeNum / item.count) * 100} />
            </div>
            <div className={styles.buttons}>
              <LinkButton
                onClick={() => {
                  setVisible(setpSetDetails.map(skuItem=>({...skuItem,num:parseInt(skuItem.num) * parseInt(item.count)})));
                }}
              >
                查看产出物料
              </LinkButton>
              <LinkButton
                className={styles.dispatch}
                onClick={() => {
                  history.push(`/Work/Production/CreateTask?id=${item.workOrderId}&max=${item.count}&shipName=${shipSetpResult.shipSetpName}`);
                }}
              >
                指派任务
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
