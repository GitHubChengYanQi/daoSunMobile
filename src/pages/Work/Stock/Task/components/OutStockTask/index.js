import React from 'react';
import style from '../../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { history } from 'umi';
import { ReceiptsEnums } from '../../../../../Receipts';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../../../../components/MyDate';
import { Divider } from 'antd-mobile';
import OutSkuItem from '../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/OutSkuAction/compoennts/OutSkuItem';

const OutStockTask = (
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

    return <div key={index} className={style.orderItem}>
      <div className={style.data}>
        <div className={style.customer}  onClick={() => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.outstockOrder}&formId=${receipts.pickListsId}`);
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
        outSkus.map((skuItem, skuIndex) => {

          if (!item.allSku && skuIndex > 1) {
            return null;
          }

          return <OutSkuItem data={outSkus} item={skuItem} key={skuIndex} />;
        })
      }
      {outSkus.length > 2 && <Divider className={style.allSku}>
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
        <div className={style.announcements}>{ToolUtil.isArray(receipts.announcementsResults).map(item => item.content).join('、')}</div>
      </div>
    </div>;
  });
};

export default OutStockTask;
