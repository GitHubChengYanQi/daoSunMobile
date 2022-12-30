import React, { useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import MyList from '../../../../components/MyList';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../../../components/MyLoading';
import { isArray } from '../../../../../util/ToolUtil';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { outStockLogView } from '../../../components/WorkContrast';


const ExecuteNumber = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([1, 2, 3]);

  const [open, setOpen] = useState();

  return <MyList data={list} manual>
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}>{item.userResult?.name || '无'}</div>
          {params.searchType === 'ORDER_LOG' ?
            <div>共 <span className='numberBlue'>{item.orderCount || 0}</span>次 </div>
            :
            <div>共<span className='numberBlue'>
              {item.inSkuCount || 0}</span>类
              <span className='numberBlue'>{item.inNumCount || 0}</span>件
            </div>}
          <div onClick={() => {
            setOpen(show ? undefined : index);
            if (show) {
              return;
            }
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={!(open === index)}>
          {
            [1, 2, 3].map((item, index) => {
              return <div key={index} className={styles.skuItem}>
                <SkuItem skuResult={item.skuResult} className={styles.sku} extraWidth='124px' />
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


export default ExecuteNumber;
