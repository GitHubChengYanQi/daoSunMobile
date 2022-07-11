import React from 'react';
import { history } from 'umi';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { RightOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../../../components/MyDate';
import SkuItem from '../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';

const ForwardItem = (
  {
    item,
  },
) => {

  const receipts = item.receipts || {};

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
    <div onClick={onClick} style={{ padding: '0 12px' }}>
      <SkuItem skuResult={receipts.skuResult} otherData={[
        ToolUtil.isObject(receipts.customer).customerName,
      ]} />
    </div>
  </div>;
};

export default ForwardItem;
