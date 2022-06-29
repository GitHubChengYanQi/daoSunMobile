import React from 'react';
import style from '../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../Receipts';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import { Divider } from 'antd-mobile';
import InSkuItem
  from '../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/SkuAction/components/InSkuItem';

const InStockTask = (
  {
    data = [],
    setData = () => {
    },
  },
) => {

  const dataChange = (param, currentIndex) => {
    const newData = data.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...param };
      }
      return item;
    });
    setData(newData);
  };

  return data.map((item, index) => {

    const receipts = item.receipts || {};

    const instockListResults = receipts.instockListResults || [];

    return <div key={index} className={style.orderItem}>
      <div className={style.data}>
        <div className={style.customer} onClick={() => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.instockOrder}&formId=${receipts.instockOrderId}`);
        }}>
          <div className={style.name}>
            <span className={style.title}>{item.taskName} / {receipts.coding}</span>
            <RightOutline style={{ color: '#B9B9B9' }} />
          </div>
        </div>
        <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
          {MyDate.Show(receipts.createTime)}
        </div>
      </div>
      {
        instockListResults.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          return <InSkuItem item={skuItem} data={instockListResults} key={skuIndex} />;
        })
      }
      {instockListResults.length > 2 && <Divider className={style.allSku}>
        <div onClick={() => {
          dataChange({ allSku: !item.allSku }, index);
        }}>
          {
            item.allSku ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>}
      <div className={style.data}>
        <div className={style.icon}><ExclamationCircleOutline /></div>
        <div className={style.announcements}>{ToolUtil.isArray(receipts.announcementsList).map(item => item.content).join('、')}</div>
      </div>
    </div>;
  });
};

export default InStockTask;
