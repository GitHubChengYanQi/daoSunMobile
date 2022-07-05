import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Popup } from 'antd-mobile';
import SkuError from './components/SkuError';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import Title from '../../../../../../components/Title';

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

  const masterUser = ToolUtil.isObject(data.masterUser);

  const errorTypeData = () => {
    switch (data.type) {
      case 'instock':
        return {
          receipts: masterUser.name && `${masterUser.name || '-'}的入库申请 / ${instockOrder.coding || '-'}`,
          totalTitle: '申请总数',
        };
        case 'Stocktaking':
        return {
          receipts: masterUser.name && `${masterUser.name || '-'}的盘点申请 / ${instockOrder.coding || '-'}`,
          totalTitle: '实际总数',
        };
      default:
        return {};
    }
  };

  return <>
    <div className={style.skuList}>
      {
        anomalyResults.map((item, index) => {
          return <div key={index}>
            <div className={style.skuItem} onClick={() => {
              if (getAction('verify').id && permissions) {
                setVisible(item.anomalyId);
              }
            }}>
              <div className={style.sku}>
                <SkuItem
                  extraWidth='100px'
                  skuResult={item.skuResult}
                  otherData={[
                    ToolUtil.isObject(item.customer).customerName,
                    ToolUtil.isObject(item.brand).brandName || '无品牌',
                  ]}
                />
              </div>
              <div className={style.realNumber}>
                <ShopNumber show value={item.realNumber} />
                <div className={style.status}>
                  · {item.status === 99 ? '已处理' : '处理中'}
                </div>
              </div>
            </div>

            <div className={style.error}>
              <div><span>{errorTypeData().totalTitle}：<span>{item.needNumber}</span></span>
              </div>
              <div hidden={!item.errorNumber}>数量 <span
                className={style.red}>{item.errorNumber > 0 ? `+${item.errorNumber}` : item.errorNumber}</span>
              </div>
              <div hidden={!item.otherNumber}>质量 <span className={style.yellow}>{item.otherNumber}</span></div>
            </div>
          </div>;
        })
      }
    </div>
    <div className={style.space} />
    <div className={style.data}>
      <Title className={style.label}>
        关联单据
      </Title>
      <span className={style.value}>
         {errorTypeData().receipts}
      </span>
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
