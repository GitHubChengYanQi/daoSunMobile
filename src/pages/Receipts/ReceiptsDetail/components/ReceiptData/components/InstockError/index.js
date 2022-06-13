import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Popup } from 'antd-mobile';
import SkuError from './components/SkuError';

const InstockError = (
  {
    data = {},
    currentNode = [],
    permissions,
    refresh = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push(item.action);
      });
    }
    return null;
  });

  const anomalyResults = data.anomalyResults || [];

  return <>
    <div className={style.data}>
      <span className={style.label}>
        关联单据
      </span>
      <span className={style.value}>

      </span>
    </div>

    <div className={style.skuList}>
      <div className={style.skuItem}>
        异常物料
      </div>
      {
        anomalyResults.map((item, index) => {
          return <div key={index} className={style.skuItem} onClick={() => {
            if (actions.includes('verify') && permissions) {
              setVisible(item.anomalyId);
            }
          }}>
            <div className={style.sku}>
              <SkuItem extraWidth='102px' skuResult={item.skuResult} otherDom={<div className={style.error}>
                <div>数量异常 <span className={style.red}>{item.errorNumber}</span></div>
                <div>其他异常 <span className={style.yellow}>{item.otherNumber}</span></div>
              </div>} />
            </div>
            <div className={style.status}>
              · {item.status === 99 ? '已处理' : '处理中'}
            </div>
          </div>;
        })
      }
    </div>

    <Popup onMaskClick={()=>setVisible(false)} destroyOnClose visible={visible}>
      <SkuError height='80vh' anomalyId={visible} onClose={() => setVisible(false)} onSuccess={() => {
        setVisible(false);
        refresh();
      }} />
    </Popup>
  </>;
};

export default InstockError;
