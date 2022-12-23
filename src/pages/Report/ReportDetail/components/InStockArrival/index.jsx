import React, { useState } from 'react';
import MyList from '../../../../components/MyList';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import MyEllipsis from '../../../../components/MyEllipsis';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { InStockArrivalChart, viewTotail } from '../../../InStockReport/components/Arrival';
import { instockDetailByCustomer } from '../../../components/Ranking';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

const InStockArrival = (
  {
    listRef,
    params = {},
  }) => {


  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const { loading, data, run } = useRequest(viewTotail, { manual: true });

  return <MyList api={instockDetailByCustomer} data={list} getData={setList} ref={listRef} manual>
    {list.map((item, index) => {

      const show = open === index;

      return <div key={index} className={styles.listItem}>
        <div className={styles.header}>
          <MyCheck fontSize={17} />
          <div className={styles.label}><MyEllipsis>{item.customerName || '无供应商'}</MyEllipsis></div>
          <div onClick={() => {
            setOpen(show ? undefined : index);
            if (show) {
              return;
            }
            run({ data: {} });
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={!show}>
          {loading ? <MyLoading skeleton /> : <>
            <div style={{ padding: '0 12px 12px' }}>
              <InStockArrivalChart data={data || {}} />
            </div>
            {
              [1, 2, 3].map((item, index) => {
                return <div key={index} className={styles.skuItem}>
                  <SkuItem
                    skuResult={item.skuResult}
                    className={styles.sku}
                    extraWidth='124px'
                    otherData={[
                      <span className={styles.number}>
                          到货 <span>×2000</span>
                          拒绝入库 <span className={styles.error}>×2000</span>
                        </span>,
                    ]}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div className={styles.grey}>已入库</div>
                    <ShopNumber show value={item.number} />
                  </div>
                </div>;
              })
            }
          </>}
        </div>
        <div className={styles.space} />
      </div>;
    })}
  </MyList>;
};

export default InStockArrival;
