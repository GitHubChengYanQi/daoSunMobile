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

const Supply = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const { loading, data = {}, run } = useRequest(instockCustomer, { manual: true });

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
            if (params.searchType === 'ORDER_BY_CREATE_USER') {

            } else {
              run({ data: { customerId: item.customerId } });
            }
          }}>{!show ? <DownOutline /> : <UpOutline />}</div>
        </div>
        <div className={styles.content} hidden={!show}>
          {
            loading ? <MyLoading skeleton /> : <>
              <div className={styles.supplyContent}>
                <div className={styles.supplyContentItem}>
                  <div className={styles.supplyContentLabel}>到货</div>
                  <div className={styles.supplyContentValue}>
                    <span>{data.detailSkuCount || 0}</span>类
                    <span>{data.detailNumberCount || 0}</span>件
                  </div>
                </div>
                <div className={styles.supplyContentItem}>
                  <div className={styles.supplyContentLabel}>已入库</div>
                  <div className={styles.supplyContentValue}>
                    <span className='blue'>{data.logNumberCount || 0}</span>类
                    <span className='blue'>{data.logSkuCount || 0}</span>件
                  </div>
                </div>
                <div className={styles.supplyContentItem}>
                  <div className={styles.supplyContentLabel}>拒绝入库</div>
                  <div className={styles.supplyContentValue}>
                    <span className='red'>{data.errorNumberCount || 0}</span>类
                    <span className='red'>{data.errorSkuCount || 0}</span>件
                  </div>
                </div>
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
            </>
          }
        </div>
        <div className={styles.space} />
      </div>;
    })}
  </MyList>;
};

export default Supply;
