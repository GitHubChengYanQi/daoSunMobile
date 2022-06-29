import React from 'react';
import style from '../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../Receipts';
import { AppstoreOutline, RightOutline } from 'antd-mobile-icons';
import moment from 'moment';

const MaintenanceTask = (
  {
    data = [],
  },
) => {

  return data.map((item, index) => {
    const receipts = item.receipts || {};

    return <div key={index} className={style.orderItem} style={{padding:0}}>
      <div className={style.data}>
        <div className={style.customer} onClick={() => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.maintenance}&formId=${item.formId}`);
        }}>
          <div className={style.name}>
            <span className={style.title}>{item.taskName} / {receipts.coding}</span>
            <RightOutline style={{ color: '#B9B9B9' }} />
          </div>
        </div>
        <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
          {moment(item.startTime).format('MM.DD')} — {moment(item.endTime).format('MM.DD')}
        </div>
      </div>
      <div className={style.content}>
        <div className={style.show}>
          <AppstoreOutline />
          <div className={style.showNumber}>
            <span className={style.number}>{receipts.positionCount}</span>
            <span>涉及库位</span>
          </div>
        </div>
        <div className={style.show} style={{ borderLeft: 'none' }}>
          <AppstoreOutline />
          <div className={style.showNumber}>
            <span className={style.number}>{receipts.skuCount}</span>
            <span>涉及物料</span>
          </div>
        </div>
        <div className={style.show} style={{ borderLeft: 'none' }}>
          <AppstoreOutline />
          <div className={style.showNumber}>
            <span className={style.number}>{receipts.numberCount}</span>
            <span>养护物料</span>
          </div>
        </div>
      </div>
      <div className={style.data}>
        <div style={{padding:'8px 0'}}>
          备注说明：{receipts.remark}
        </div>
      </div>
    </div>;
  });
};

export default MaintenanceTask;
