import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Popup } from 'antd-mobile';
import SkuError from './components/SkuError';
import { ToolUtil } from '../../../../../../components/ToolUtil';

const InstockError = (
  {
    data = {},
    getAction = () => {
      return {};
    },
    permissions,
    refresh = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const anomalyResults = data.anomalyResults || [];
  const instockOrder = data.instockOrder || {};

  return <>
    <div className={style.data}>
      <span className={style.label}>
        关联单据
      </span>
      <span className={style.value}>
         的入库申请 / {instockOrder.coding}
      </span>
    </div>

    <div className={style.skuList}>
      <div className={style.skuItem}>
        异常物料
      </div>
      {
        anomalyResults.map((item, index) => {
          return <div key={index} className={style.skuItem} onClick={() => {
            if (getAction('verify').id && permissions) {
              setVisible(item.anomalyId);
            }
          }}>
            <div className={style.sku}>
              <SkuItem
                extraWidth='100px'
                skuResult={item.skuResult}
                otherData={`${ToolUtil.isObject(item.customer).customerName || '-'} / ${ToolUtil.isObject(item.brand).brandName || '-'}`}
                moreDom={<div className={style.error}>
                  <div hidden={!item.errorNumber}>数量 <span
                    className={style.red}>{item.errorNumber > 0 ? `+${item.errorNumber}` : item.errorNumber}</span>
                  </div>
                  <div hidden={!item.otherNumber}>质量 <span className={style.yellow}>{item.otherNumber}</span></div>
                </div>} />
            </div>
            <div className={style.status}>
              · {item.status === 99 ? '已处理' : '处理中'}
            </div>
          </div>;
        })
      }
    </div>

    <Popup onMaskClick={() => setVisible(false)} destroyOnClose visible={visible}>
      <SkuError
        height='80vh'
        anomalyOrderId={data.orderId}
        anomalyId={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          refresh();
        }} />
    </Popup>
  </>;
};

export default InstockError;
