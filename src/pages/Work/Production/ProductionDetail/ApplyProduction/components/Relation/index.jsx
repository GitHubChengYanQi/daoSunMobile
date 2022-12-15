import React, { useState } from 'react';
import MySearch from '../../../../../../components/MySearch';
import MyCard from '../../../../../../components/MyCard';
import styles from '../../../components/Details/index.less';
import { Tabs } from 'antd-mobile';
import SkuItem from '../../../../../Sku/SkuItem';
import ShopNumber from '../../../../../AddShop/components/ShopNumber';
import MyCheck from '../../../../../../components/MyCheck';
import BottomButton from '../../../../../../components/BottomButton';

const Relation = (
  {
    onClose = () => {
    },
  },
) => {

  const [searchValue, setSearchValue] = useState();

  const [detail, setDetail] = useState({});

  return <>
    <MySearch value={searchValue} onChange={setSearchValue} />
    <MyCard
      className={styles.card}
      headerClassName={styles.header}
      title='配套产品'
      extra={<Tabs defaultActiveKey={1} className={styles.tabs}>
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

    <MyCard
      titleBom={<div className={styles.tabDiv}>产品编号</div>}
      className={styles.card}
      headerClassName={styles.tabDivHeader}
    >
      {
        [1, 2].map((item, index) => {
          return <div key={index} className={styles.customer}>
            <div className={styles.customerContract}>
              客户/合同：危地马拉/HGLSI038852
            </div>
            {
              [1, 2, 3].map((item, index) => {
                return <div key={index} className={styles.coding}>
                  <div>0HT00000000001</div>
                  <MyCheck />
                </div>;
              })
            }
          </div>;
        })
      }
    </MyCard>
    <div style={{ height: 60 }} />
    <BottomButton leftOnClick={onClose} />
  </>;
};

export default Relation;
