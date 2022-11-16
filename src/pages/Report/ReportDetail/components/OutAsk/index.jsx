import React, { useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { outStockDetailView } from '../../../components/Ranking';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';

const OutAsk = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [openList, setOpenList] = useState([]);

  return <MyList api={outStockDetailView} data={list} getData={setList} ref={listRef} manual>
    {list.map((item, index) => {

      const open = openList.find(item => item === index) !== undefined;

      const skuAndNumbers = isArray(item.skuAndNumbers);

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}>{item.userResult?.name || '无'}</div>
          {params.searchType === 'ORDER_BY_CREATE_USER' ?
            <div>共申请 <span className='numberBlue'>{item.orderCount || 0}</span>次 </div>
            :
            <div>共<span className='numberBlue'>
              {item.outSkuCount || 0}</span>类
              <span className='numberBlue'>{item.outNumCount || 0}</span>件
            </div>}
          <div onClick={() => {
            setOpenList(open ? openList.filter(item => item !== index) : [...openList, index]);
          }}>{open ? <DownOutline /> : <RightOutline />}</div>
        </div>
        <div className={styles.content} hidden={!open}>
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
