import React, { useState } from 'react';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import MyCard from '../../../../../components/MyCard';
import MyCheck from '../../../../../components/MyCheck';
import { isArray } from '../../../../../components/ToolUtil';
import SkuItem from '../../../../Sku/SkuItem';
import styles from '../../index.less';
import MyEllipsis from '../../../../../components/MyEllipsis';
import Label from '../../../../../components/Label';

export const pendingProductionPlan = {
  url: '/order/pendingProductionPlan',
  method: 'POST',
};

const Plan = (
  {
    checkedSkus,
    setCheckedSkus,
  },
) => {

  const [skuKeys, setSkuKeys] = useState([]);

  const { loading, data } = useRequest(pendingProductionPlan);

  if (loading) {
    return <MyLoading skeleton type='descriptions' />;
  }

  const onChecked = (checked, rowItem, skuRecord) => {
    if (checked) {
      const skuDetails = checkedSkus.filter((item) => {
        return item.skuId === rowItem.skuId;
      });
      if (skuDetails.length + 1 === skuRecord.children.length) {
        setSkuKeys([...skuKeys, skuRecord.skuId]);
      }
      setCheckedSkus([...checkedSkus, rowItem]);
    } else {
      const array = checkedSkus.filter((item) => {
        return item.detailId !== rowItem.detailId;
      });
      setCheckedSkus(array);
      const skus = skuKeys.filter((item) => {
        return item !== skuRecord.skuId;
      });
      setSkuKeys(skus);
    }
  };

  return data.map((skuItem, skuIndex) => {
    const details = skuItem.children;
    const skuResult = skuItem.skuResult || {};
    const disabled = !skuResult.processResult;
    const skuChecked = skuKeys.includes(skuItem.skuId);
    const skuDisabled = details.filter(item => !(item.orderResult?.contractId)).length === details.length || disabled;

    return <div key={skuIndex} className={styles.order}>
      <MyCard
        headerClassName={styles.header}
        style={{ padding: 0 }}
        titleBom={<div
          className={styles.flexCenter}
          onClick={() => {
            if (skuDisabled) {
              return;
            }
            if (!skuChecked) {
              setSkuKeys([...skuKeys, skuItem.skuId]);
              setCheckedSkus([...checkedSkus, ...skuItem.children]);
            } else {
              const array = skuKeys.filter((item) => {
                return item !== skuItem.skuId;
              });
              setSkuKeys(array);
              const skus = checkedSkus.filter((item) => {
                return array.includes(item.skuId);
              });
              setCheckedSkus(skus);
            }
          }}
        >
          <MyCheck
            fontSize={16}
            disabled={skuDisabled}
            checked={skuChecked}
          />
          <SkuItem noView className={styles.sku} extraWidth='120px' skuResult={skuResult} />
        </div>}
        extra={disabled && <span className={styles.red} style={{ marginLeft: 8 }}>无工艺</span>}
      >
        {
          details.map((rowItem, rowIndex) => {
            const order = rowItem.orderResult || {};
            const checked = checkedSkus.map(item => item.detailId).includes(rowItem.detailId);
            const detailDisabled = !order.contractId || disabled;
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
                onChecked(!checked, rowItem, skuItem);
              }}
            >
              <MyCheck
                fontSize={16}
                disabled={detailDisabled}
                checked={checked}
              />
              <div className={styles.info}>
                <div className={styles.infoItem}><Label className={styles.label}>订单号</Label>：{order.coding}</div>
                <div className={styles.infoItem}><Label className={styles.label}>客户</Label>：{order.acustomer?.customerName}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                {!order.contractId && <div className={styles.red}>无合同</div>}
                × {rowItem.purchaseNumber}
              </div>
            </div>;
          })
        }
      </MyCard>
    </div>;
  });
};

export default Plan;
