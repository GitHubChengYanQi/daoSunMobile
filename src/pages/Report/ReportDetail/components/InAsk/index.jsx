import React, { useState } from 'react';
import { isArray } from '../../../../components/ToolUtil';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { MyDate } from '../../../../components/MyDate';

const instockDetail = { url: '/statisticalView/instockDetail', method: 'POST' };

const instockOrders = { url: '/statisticalView/instockOrders', method: 'POST' };

export const instockOrderCountViewByUserDetail = {
  url: '/statisticalView/instockOrderCountViewByUserDetail',
  method: 'POST',
};

const InAsk = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const { loading, data = [], run } = useRequest(instockDetail, { manual: true });

  const {
    loading: instockOrdersLoading,
    data: instockOrdersData = [],
    run: instockOrdersRun,
  } = useRequest(instockOrders, { manual: true });

  return <MyList
    api={instockOrderCountViewByUserDetail}
    data={list}
    getData={setList}
    ref={listRef}
    onLoading={() => {
      setOpen(null);
    }}
    manual
  >
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}>{item.userResult?.name || '无'}</div>
          {params.searchType === 'ORDER_BY_CREATE_USER' ?
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
            if (params.searchType === 'ORDER_BY_CREATE_USER') {
              instockOrdersRun({ data: { userId: item.userResult?.userId } });
            } else {
              run({ data: { userId: item.userResult?.userId } });
            }
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={params.searchType !== 'ORDER_BY_CREATE_USER' || !show}>
          {
            instockOrdersLoading ? <MyLoading skeleton /> : instockOrdersData.map((item, index) => {
              return <div key={index} className={styles.taskItem}>
                <div className={styles.taskHeader}>
                  <div className={styles.title}>{item.theme || '无主题'}</div>
                  <div className={styles.time}>{MyDate.Show(item.createTime)}</div>
                </div>
                <div className={styles.taskContent}>
                  执行人：{isArray(item.processUsers).map(item => item.name).join('、')}{isArray(item.processUsers).length === 0 && '无'}
                </div>
              </div>;
            })
          }
        </div>
        <div className={styles.content} hidden={params.searchType !== 'ORDER_BY_DETAIL' || !(open === index)}>
          {
            loading ? <MyLoading skeleton /> : isArray(data).map((item, index) => {
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

export default InAsk;
