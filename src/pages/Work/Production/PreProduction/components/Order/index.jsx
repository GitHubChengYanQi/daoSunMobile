import React, { useState } from 'react';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import MyCard from '../../../../../components/MyCard';
import MyCheck from '../../../../../components/MyCheck';
import { isArray } from '../../../../../../util/ToolUtil';
import SkuItem from '../../../../Sku/SkuItem';
import styles from '../../index.less';
import MyEllipsis from '../../../../../components/MyEllipsis';

export const pendingProductionByOrder = {
  url: '/order/pendingProductionPlanByContracts',
  method: 'POST',
};

const Order = (
  {
    checkedSkus,
    setCheckedSkus,
  },
) => {

  const [orderKeys, setOrderKeys] = useState([]);

  const { loading, data } = useRequest(pendingProductionByOrder);

  if (loading) {
    return <MyLoading skeleton type='descriptions' />;
  }

  const onChecked = (checked, rowItem, orderItem) => {
    if (checked) {
      const orderDetails = checkedSkus.filter((item) => {
        return item.orderId === rowItem.orderId;
      });
      const details = orderItem.detailResults && orderItem.detailResults.filter(item => item.skuResult && item.skuResult.processResult);
      if (orderDetails.length + 1 === details.length) {
        setOrderKeys([...orderKeys, rowItem.orderId]);
      }
      setCheckedSkus([...checkedSkus, rowItem]);
    } else {
      const array = checkedSkus.filter((item) => {
        return item.detailId !== rowItem.detailId;
      });
      setCheckedSkus(array);
      const orders = orderKeys.filter((item) => {
        return item !== rowItem.orderId;
      });
      setOrderKeys(orders);
    }
  };

  return data.map((orderItem, orderIndex) => {
    const details = isArray(orderItem.detailResults).map(item => ({
      ...item,
      orderResult: { ...orderItem, detailResults: undefined },
    }));
    const disabled = !orderItem.contractId;
    const orderChecked = orderKeys.includes(orderItem.orderId);
    const orderDisabled = details.filter(item => !(item.skuResult?.processResult)).length === details.length || disabled;
    return <div key={orderIndex} className={styles.order}>
      <MyCard
        headerClassName={styles.header}
        style={{ padding: 0 }}
        titleBom={<div
          className={styles.flexCenter}
          onClick={() => {
            if (orderDisabled) {
              return;
            }
            if (!orderChecked) {
              setOrderKeys([...orderKeys, orderItem.orderId]);
              const newDetails = details.filter(item => item.skuResult?.processResult);
              setCheckedSkus([...checkedSkus, ...newDetails]);
            } else {
              const array = orderKeys.filter((item) => {
                return item !== orderItem.orderId;
              });
              setOrderKeys(array);
              const skus = checkedSkus.filter((item) => {
                return array.includes(item.orderId);
              });
              setCheckedSkus(skus);
            }
          }}
        >
          <MyCheck
            fontSize={16}
            disabled={orderDisabled}
            checked={orderChecked}
          />
          <MyEllipsis
            width='max-content'
            maxWidth='40vw'
          >
            {orderItem.coding} / {orderItem?.acustomer?.customerName}
          </MyEllipsis>
          {disabled && <span className={styles.red} style={{ marginLeft: 8 }}>无合同</span>}
        </div>}
        extraClassName={styles.extra}
        extra={orderItem.createTime}
      >
        {
          details.map((rowItem, rowIndex) => {
            const skuResult = rowItem.skuResult || {};
            const checked = checkedSkus.map(item => item.detailId).includes(rowItem.detailId);
            const detailDisabled = !skuResult.processResult || disabled;
            return <div
              key={rowIndex}
              className={styles.detailItem}
              style={rowIndex === details.length - 1 ? {
                border: 'none',
                paddingBottom: 0,
                marginBottom: 0,
              } : {}}
              onClick={() => {
                if (detailDisabled) {
                  return;
                }
                onChecked(!checked, rowItem, orderItem);
              }}
            >
              <MyCheck
                fontSize={16}
                disabled={detailDisabled}
                checked={checked}
              />
              <SkuItem noView className={styles.sku} extraWidth='120px' skuResult={skuResult} />
              <div style={{ textAlign: 'center' }}>
                {!skuResult.processResult && <div className={styles.red}>无工艺</div>}
                × {rowItem.purchaseNumber}
              </div>
            </div>;
          })
        }
      </MyCard>
    </div>;
  });
};

export default Order;
