import React from 'react';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import style from '../../../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../../../Receipts';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../../../components/MyDate';
import OutSkuItem
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/OutSkuItem';
import { Divider } from 'antd-mobile';
import MyEmpty from '../../../../../../../components/MyEmpty';

const OutStockItem = (
  {
    item = {},
    index,
    onChange = () => {
    },
  }) => {

  const receipts = item.receipts || {};

  const detailResults = receipts.detailResults || [];

  const actions = [];
  const noAction = [];

  let countNumber = 0;
  detailResults.map(item => {
    let perpareNumber = 0;
    ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

    const complete = item.status === 99;
    const prepare = complete ? false : perpareNumber === item.number;

    if (complete || prepare) {
      noAction.push({ ...item, complete, prepare, perpareNumber });
    } else {
      actions.push({ ...item, complete, prepare, perpareNumber });
    }
    return countNumber += (item.number || 0);
  });

  const outSkus = [...actions, ...noAction];

  const announcementsResults = ToolUtil.isArray(receipts.announcementsResults);

  const onClick = () => {
    history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
  };

  return <div key={index} className={style.orderItem}>
    <div className={style.data}>
      <div className={style.customer} onClick={onClick}>
        <div className={style.name}>
          <span className={style.title}>{item.taskName || '-'} / {receipts.coding || '-'}</span>
          <RightOutline style={{ color: '#B9B9B9' }} />
        </div>
      </div>
      <div className={style.status} style={{ color: '#555555', width: 130, textAlign: 'right' }}>
        {MyDate.Show(item.createTime)}
      </div>
    </div>
    <div onClick={onClick}>
      {outSkus.length === 0 && <MyEmpty description='暂无出库物料' />}
      {
        outSkus.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          return <OutSkuItem data={outSkus} item={skuItem} key={skuIndex} />;
        })
      }
    </div>

    {outSkus.length > 2 && <Divider className={style.allSku}>
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
    <div className={style.data} hidden={announcementsResults.length === 0}>
      <div className={style.icon}><ExclamationCircleOutline /></div>
      <div
        className={style.announcements}
      >
        {announcementsResults.map(item => item.content).join('、')}
      </div>
    </div>
  </div>;
};

export default OutStockItem;
