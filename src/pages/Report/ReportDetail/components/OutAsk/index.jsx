import React, { useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { instockOrderCountViewByUser, outStockDetailView } from '../../../components/Ranking';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { MyLoading } from '../../../../components/MyLoading';
import { MyDate } from '../../../../components/MyDate';

const OutAsk = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  return <MyList api={outStockDetailView} data={list} getData={setList} ref={listRef} manual>
    {list.map((item, index) => {

      const show = open === index;

      const skuAndNumbers = isArray(item.skuAndNumbers);

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}>{item.userResult?.name || '无'}</div>
          {params.searchType === 'ORDER_BY_CREATE_USER' ?
            <div>共 <span className='numberBlue'>{item.orderCount || 0}</span>次 </div>
            :
            <div>共<span className='numberBlue'>
              {item.outSkuCount || 0}</span>类
              <span className='numberBlue'>{item.outNumCount || 0}</span>件
            </div>}
          <div onClick={() => {
            setOpen(show ? undefined : index);
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={params.searchType !== 'ORDER_BY_CREATE_USER' || !show}>
          {
            [1, 2, 3].map((item, index) => {
              return <div key={index} className={styles.taskItem}>
                <div className={styles.taskHeader}>
                  <div className={styles.title}>第三机械22-1021A</div>
                  <div className={styles.time}>{MyDate.Show(new Date())}</div>
                </div>
                <div className={styles.taskContent}>
                  执行人：梁彦欣
                </div>
              </div>;
            })
          }
        </div>
        <div className={styles.content} hidden={params.searchType !== 'ORDER_BY_DETAIL' || !(open === index)}>
          {
            skuAndNumbers.map((item, index) => {
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

export default OutAsk;
