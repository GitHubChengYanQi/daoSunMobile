import React from 'react';
import { history } from 'umi';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../../../components/MyDate';
import MyEmpty from '../../../../../../../components/MyEmpty';
import InSkuItem
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/SkuAction/components/InSkuItem';

const ForwardItem = (
  {
    item,
  },
) => {

  const receipts = item.receipts || {};

  const instockListResults = receipts.instockListResults || [];

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <div className={style.orderItem}>
    <div className={style.data}>
      <div className={style.customer} onClick={onClick}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(receipts.createTime)}
      </div>
    </div>
    <div onClick={onClick}>
      {instockListResults.length === 0 && <MyEmpty description='暂无物料' />}
      {
        instockListResults.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          return <InSkuItem item={skuItem} data={instockListResults} key={skuIndex} />;
        })
      }
    </div>
  </div>;
};

export default ForwardItem;
