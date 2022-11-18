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

const instockCustomer = { url: '/statisticalView/instockCustomer', method: 'POST' };

const OutStockUseNumber = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  return <MyList api={instockDetailByCustomer} data={list} getData={setList} ref={listRef} manual>
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}><MyEllipsis>{item.customerName || '无供应商'}</MyEllipsis></div>
          <div>共<span className='numberBlue'>
              {item.inSkuCount || 0}</span>类
            <span className='numberBlue'>{item.inNumCount || 0}</span>件
          </div>
          <div onClick={() => {
            setOpen(show ? undefined : index);
            if (show) {
              return;
            }
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={!show}>
          {
            [1, 2, 3].map((item, index) => {
              return <div key={index} className={styles.skuItem}>
                <SkuItem
                  skuResult={item.skuResult}
                  className={styles.sku}
                  extraWidth='124px'
                  otherData={[
                    '丹东汉克',
                  ]}
                />
                <ShopNumber show value={item.number} />
              </div>;
            })
          }
        </div>
        <div className={styles.space} />
      </div>;
    })}
  </MyList>;
};

export default OutStockUseNumber;
