import React from 'react';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../../../components/MyDate';
import InSkuItem
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/SkuAction/components/InSkuItem';
import { Divider } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import MyEmpty from '../../../../../../../components/MyEmpty';

const InStockItem = (
  {
    item = {},
    index,
    onChange = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const instockListResults = receipts.instockListResults || [];

  const announcementsList = ToolUtil.isArray(receipts.announcementsList);

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <div className={style.orderItem}>
    <div className={style.data}>
      <div className={style.customer} onClick={onClick}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName} / {receipts.coding}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(receipts.createTime)}
      </div>
    </div>
    <div onClick={onClick}>
      {instockListResults.length === 0 && <MyEmpty description='暂无入库物料' />}
      {
        instockListResults.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          return <InSkuItem item={skuItem} data={instockListResults} key={skuIndex} />;
        })
      }
    </div>

    {instockListResults.length > 2 && <Divider className={style.allSku}>
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
    <div className={style.data} hidden={announcementsList.length === 0}>
      <div className={style.icon}><ExclamationCircleOutline /></div>
      <div
        className={style.announcements}
      >{announcementsList.map(item => item.content).join('、')}</div>
    </div>
  </div>;
};

export default InStockItem;
