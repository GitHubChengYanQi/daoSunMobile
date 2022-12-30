import React, { useState } from 'react';
import { isArray } from '../../../../../util/ToolUtil';
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

const ErrorSkus = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([1,2,3,4]);

  return list.map((item, index) => {

    return <div key={index} className={styles.listItem}>
      <div key={index} className={styles.skuItem}>
        <MyCheck fontSize={17} />
        <SkuItem
          skuResult={item.skuResult}
          className={styles.sku}
          extraWidth='174px'
        />
        <div style={{ textAlign: 'center' }}>
          <ShopNumber show value={item.number} />
          <LinkButton>详情</LinkButton>
        </div>
      </div>
    </div>;
  })
};

export default ErrorSkus;
