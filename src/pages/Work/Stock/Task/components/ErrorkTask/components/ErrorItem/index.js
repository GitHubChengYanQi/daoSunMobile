import React from 'react';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { DownOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../../../components/MyDate';
import { Divider } from 'antd-mobile';
import MyEmpty from '../../../../../../../components/MyEmpty';
import Item
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockError/components/ErrorItem';

const ErrorItem = (
  {
    item = {},
    index,
    onChange = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const anomalyResults = receipts.anomalyResults || [];

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <div className={style.orderItem}>
    <div className={style.data}>
      <div className={style.customer} onClick={onClick}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName} / {receipts.coding || '--'}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(receipts.createTime)}
      </div>
    </div>
    <div onClick={onClick}>
      {anomalyResults.length === 0 && <MyEmpty description='暂无物料' />}
      {
        anomalyResults.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          let totalTitle = '';
          switch (receipts.type) {
            case 'instock':
              totalTitle = '申请总数';
              break;
            case 'Stocktaking':
              totalTitle = '实际总数';
              break;
            default:
              break;
          }

          return <div key={skuIndex} style={{ padding: '0 12px' }}>
            <Item
              totalTitle={totalTitle}
              item={skuItem}
              index={index}
            />
          </div>;
        })
      }
    </div>

    {anomalyResults.length > 2 && <Divider className={style.allSku}>
      <div onClick={() => {
        onChange({ allSku: !item.allSku }, index);
      }}>
        {
          item.allSku ?
            <UpOutline />
            :
            <DownOutline />
        }
      </div>
    </Divider>}
  </div>;
};

export default ErrorItem;
