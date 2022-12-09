import React, { useState } from 'react';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import SkuItem from '../../../../Sku/SkuItem';
import styles from './index.less';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import MyAntPopup from '../../../../../components/MyAntPopup';
import { Tabs } from 'antd-mobile';

const Details = ({ data = [] }) => {

  const [detail, setDetail] = useState();

  return <>
    <MySearch className={styles.search} />
    {
      data.map((item, index) => {
        return <div key={index} className={styles.item}>
          <MyCard
            className={styles.card}
            headerClassName={styles.header}
            title={`部件${index + 1}`}
            extra={<div>
              <span>已投产：10</span>
              <span style={{ paddingLeft: 12 }}>可投产：1</span>
            </div>}
          >
            <div className={styles.flexCenter}>
              <SkuItem imgSize={48} className={styles.flexGrow} skuResult={item.skuResult} />
              <ShopNumber show value={item.planNumber} />
            </div>
            <div className={styles.ships}>
              {
                [1, 2].map((item, index) => {
                  return <div key={index} className={styles.flexCenter}>
                    <div className={styles.flexGrow}>工序：T5一米床身装配序</div>
                    8/8
                  </div>;
                })
              }
            </div>
          </MyCard>
          <div className={styles.buttons}>
            <LinkButton onClick={() => setDetail(item)}>生产详情</LinkButton>
            <div className={styles.space} />
            <LinkButton>申请投产</LinkButton>
          </div>
        </div>;
      })
    }


    <MyAntPopup
      title='生产物料详情'
      visible={detail}
      onClose={() => setDetail()}
    >
      <MyCard
        className={styles.card}
        headerClassName={styles.header}
        title='部件'
        extra={<div>
          <span>已投产：10</span>
          <span style={{ paddingLeft: 12 }}>可投产：1</span>
        </div>}
      >
        <div className={styles.flexCenter}>
          <SkuItem imgSize={56} className={styles.flexGrow} skuResult={detail?.skuResult} />
          <ShopNumber show value={detail?.planNumber} />
        </div>
      </MyCard>

      <MyCard
        className={styles.card}
        headerClassName={styles.header}
        title='配套产品'
        extra={<Tabs defaultActiveKey='1' className={styles.tabs}>
          {
            [1, 2, 3, 4, 5].map((item, index) => {
              return <Tabs.Tab title={`产品${index + 1}`} key={index} />;
            })
          }
        </Tabs>}
      >
        <div className={styles.flexCenter}>
          <SkuItem imgSize={56} className={styles.flexGrow} skuResult={detail?.skuResult} />
          <ShopNumber show value={detail?.planNumber} />
        </div>
      </MyCard>

      <MyCard>
        
      </MyCard>
    </MyAntPopup>
  </>;
};

export default Details;
