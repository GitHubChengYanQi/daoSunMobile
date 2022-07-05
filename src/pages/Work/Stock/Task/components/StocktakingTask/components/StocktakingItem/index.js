import React from 'react';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { AppstoreOutline, RightOutline } from 'antd-mobile-icons';
import moment from 'moment';

const StocktakingItem = ({item,index}) => {
  const receipts = item.receipts || {};

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  }

  return <div key={index} className={style.orderItem} style={{ padding: 0 }} onClick={onClick}>
    <div className={style.data}>
      <div className={style.customer}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName} / {receipts.coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {moment(item.beginTime).format('MM.DD')} — {moment(item.endTime).format('MM.DD')}
      </div>
    </div>
    <div className={style.content}>
      <div className={style.show}>
        <AppstoreOutline />
        <div className={style.showNumber}>
          <span className={style.number}>{receipts.positionSize}</span>
          <span>涉及库位</span>
        </div>
      </div>
      <div className={style.show} style={{ borderLeft: 'none' }}>
        <AppstoreOutline />
        <div className={style.showNumber}>
          <span className={style.number}>{receipts.skuSize}</span>
          <span>涉及物料</span>
        </div>
      </div>
    </div>
    <div className={style.methodAndMode}>
      <div className={style.method}>
        方法：{receipts.method === 'OpenDisc' ? '明盘' : '暗盘'}
      </div>
      <div className={style.mode}>
        方式：{receipts.method === 'dynamic' ? '动态' : '静态'}
      </div>
    </div>
    <div className={style.data}>
      <div style={{ padding: '8px 0' }}>
        备注说明：{receipts.remark}
      </div>
    </div>
  </div>;
};

export default StocktakingItem;
