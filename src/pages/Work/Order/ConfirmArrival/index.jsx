import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MyNavBar from '../../../components/MyNavBar';
import { isArray } from '../../../../util/ToolUtil';
import SkuItem from '../../Sku/SkuItem';
import styles from './index.less';
import ShopNumber from '../../AddShop/components/ShopNumber';
import BottomButton from '../../../components/BottomButton';
import { ERPEnums } from '../../Stock/ERPEnums';

const ConfirmArrival = () => {

  const history = useHistory();

  const { state, query } = useLocation();

  const [skus, setSkus] = useState(isArray(state?.skus).map(item => ({
    ...item,
    number: (item.purchaseNumber || 0) - (item.arrivalNumber || 0) > 0 ? (item.purchaseNumber || 0) - (item.arrivalNumber || 0) : 0,
  })));

  const skuChange = (param, key) => {
    const newSkus = skus.map((item, index) => {
      if (index === key) {
        return { ...item, ...param };
      }
      return item;
    });

    setSkus(newSkus);
  };

  useEffect(() => {
    if (skus.length === 0) {
      history.replace(`/Work/Order/Detail?id=${query.id}`);
    }
  }, []);

  return <>
    <MyNavBar title='确认到货' />

    <div className={styles.confirmArrival}>
      {
        skus.map((item, index) => {
          return <div key={index} className={styles.skuItem}>
            <SkuItem
              extraWidth='100px'
              className={styles.sku}
              skuResult={item.skuResult}
              otherData={[
                item.brandResult?.brandName,
                item.customerResult?.customerName,
              ]}
            />
            <div style={{ textAlign: 'center' }}>
              <span style={{ paddingBottom: 8, display: 'block' }}>到货数</span>
              <ShopNumber
                min={0}
                value={item.number || 0}
                onChange={(number) => {
                  skuChange({ number }, index);
                }}
              />
            </div>
          </div>;
        })
      }
    </div>

    <div style={{ height: 60 }} />

    <BottomButton
      disabled={skus.filter(item => item.number).length === 0}
      text='发起入库任务'
      only
      onClick={() => {
        history.push({
          pathname: '/Work/CreateTask',
          query: {
            createType: ERPEnums.inStock,
            submitType: 'purchaseOrder',
          },
          state: {
            instockType: 'PURCHASE_INSTOCK',
            customerId: state.customerId,
            customerName: state.customerName,
            skus: skus.filter(item => item.number).map(item => ({
              brandId: item.brandId,
              brandName: item.brandResult?.brandName,
              customerId: item.customerId,
              customerName: item.customerResult?.customerName,
              number: item.number,
              skuId: item.skuId,
              skuResult: item.skuResult,
              orderDetailId: item.detailId,
            })),
            numberStatus: 'disabled',
            orderId: query.id,
          },
        });
      }}
    />
  </>;
};

export default ConfirmArrival;
