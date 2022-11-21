import React, { useState } from 'react';
import { isArray } from '../../../../components/ToolUtil';
import { instockDetailByCustomer } from '../../../components/Ranking';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { MyDate } from '../../../../components/MyDate';
import MyEllipsis from '../../../../components/MyEllipsis';
import LinkButton from '../../../../components/LinkButton';
import MyAntPopup from '../../../../components/MyAntPopup';

const InStockError = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([1, 2, 3, 4]);

  const [visible, setVisible] = useState();

  return <>
    {list.map((item, index) => {

      return <div key={index} className={styles.listItem}>
        <div key={index} className={styles.skuItem}>
          <MyCheck fontSize={17} />
          <SkuItem
            skuResult={item.skuResult}
            className={styles.sku}
            extraWidth='174px'
          />
          <div style={{ textAlign: 'right' }}>
            <ShopNumber show value={item.number} />
            <LinkButton onClick={() => setVisible(true)}>来源明细</LinkButton>
          </div>
        </div>
      </div>;
    })}
    <MyAntPopup title='来源明细' visible={visible} onClose={() => setVisible(false)}>
      <div className={styles.skuItem} style={{ border: 'none' }}>
        <SkuItem
          className={styles.sku}
          extraWidth='124px'
        />
        <ShopNumber show />
      </div>
      {
        [1, 2, 3].map((item, index) => {
          return <div className={styles.customerItem} key={index}>
            <div className={styles.title}>辽宁辽工智能装备制造有限公司</div>
            ×1000
          </div>;
        })
      }
    </MyAntPopup>
  </>;
};

export default InStockError;
