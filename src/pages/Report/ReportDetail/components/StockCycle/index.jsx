import React, { useImperativeHandle, useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { stockNumberCycle } from '../../../Comprehensive/components/CycleStatistics';

export const stockNumberCycleDetail = { url: '/statisticalView/stockNumberCycleDetail', method: 'POST', data: {} };

const StockCycle = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [skus,setSkus] = useState([]);

  const [open, setOpen] = useState();

  const { loading, run } = useRequest(stockNumberCycle, {
    manual: true,
    onSuccess: (res) => {
      const month1 = res['1month'].number || 0;
      const month2 = res['1month-3month'].number || 0;
      const month3 = res['3month-6month'].number || 0;
      const month4 = res['after6month'].number || 0;

      const total = month1 + month2 + month3 + month4;

      setList([
        {
          number: month1,
          skuCount: res['1month'].skuCount,
          num: Math.round((month1 / total) * 100) || 0,
          color: '#257BDE',
          text: '1个月内',
          key: '1month',
        },
        {
          number: month2,
          skuCount: res['1month-3month'].skuCount,
          num: Math.round((month2 / total) * 100) || 0,
          color: '#2EAF5D',
          text: '1-3个月',
          key: '1month-3month',
        },
        {
          number: month3,
          skuCount: res['3month-6month'].skuCount,
          num: Math.round((month3 / total) * 100) || 0,
          color: '#FA8F2B',
          text: '3-6个月',
          key: '3month-6month',
        },
        {
          number: month4,
          skuCount: res['after6month'].skuCount,
          num: total <= 0 ? 0 : 100 - (Math.round((month1 / total) * 100) || 0) - (Math.round((month2 / total) * 100) || 0) - (Math.round((month3 / total) * 100) || 0),
          color: '#FF3131',
          text: '6个月以上',
          key: 'after6month',
        },
      ]);
    },
  });

  const { loading: detailLoaidng, run: detailRun } = useRequest(stockNumberCycleDetail, {
    manual: true,
    onSuccess: (res) => {
      setSkus(res);
    },
  });

  const submit = (params) => {
    run({ data: params });
  };

  useImperativeHandle(listRef, () => ({
    submit,
  }));

  if (loading) {
    return <MyLoading skeleton />;
  }

  return list.length === 0 ? <MyEmpty /> : list.map((item, index) => {
    const show = open === index;

    return <div key={index} className={styles.listItem}>
      <div className={styles.header}>
        <MyCheck fontSize={17} />
        <div className={styles.label}>{item.text}</div>
        <div onClick={() => {
          setOpen(show ? undefined : index);
          if (show) {
            return;
          }
          detailRun({ data: { cycle: item.key } });
        }}>
          {`${item.skuCount || 0} 类 ${item.number || 0} 件`}
          &nbsp;&nbsp;
          {!show ? <DownOutline /> : <UpOutline />}</div>
      </div>
      <div className={styles.content} hidden={!show}>
        {!detailLoaidng && skus.length === 0 && <MyEmpty />}
        {
          detailLoaidng ? <MyLoading skeleton /> : skus.map((item, index) => {
            return <div key={index} className={styles.skuItem}>
              <SkuItem
                skuResult={item.skuSimpleResult}
                className={styles.sku}
                extraWidth='124px'
              />
              <div style={{ textAlign: 'right' }}>
                <ShopNumber show value={item.number} />
              </div>
            </div>;
          })
        }
      </div>
      <div className={styles.space} />
    </div>;
  });
};

export default StockCycle;
