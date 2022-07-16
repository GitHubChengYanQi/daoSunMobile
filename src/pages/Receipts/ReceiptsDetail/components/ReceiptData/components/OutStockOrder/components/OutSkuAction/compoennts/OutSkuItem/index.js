import React from 'react';
import style
  from '../../../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Progress } from 'antd';
import { collectableColor, notPreparedColor, receivedColor } from '../MyPicking';
import pickStyle from '../MyPicking/index.less';

const OutSkuItem = ({ item, data }) => {
  const skuResult = item.skuResult || {};

  let stockNumberColor = '';
  let stockNumberText = '';

  switch (item.stockNumber || 0) {
    case 0:
      stockNumberColor = '#EA0000';
      stockNumberText = '零库存';
      break;
    default:
      if (item.isMeet) {
        stockNumberColor = '#2EAF5D';
        stockNumberText = '库存充足';
      } else {
        stockNumberColor = '#257BDE';
        stockNumberText = '部分满足';
      }
      break;
  }

  const received = item.receivedNumber;
  const collectable = item.perpareNumber;
  const notPrepared = item.number - collectable - received;

  const successPercent = Number(((received / item.number)).toFixed(2)) * 100;
  const percent = Number(((collectable / item.number)).toFixed(2)) * 100;
  const trail = Number(((notPrepared / item.number)).toFixed(2)) * 100;

  return <div
    className={ToolUtil.classNames(style.sku, data.length <= 3 && style.skuBorderBottom)}
    style={{paddingBottom:8}}
  >
    <div
      className={style.skuItem}
    >
      <div className={style.item}>
        <SkuItem
          number={item.stockNumber}
          imgSize={60}
          skuResult={skuResult}
          extraWidth='124px'
          otherData={[ToolUtil.isObject(item.brandResult).brandName || '任意品牌']}
        />
      </div>
      <div className={style.outStockNumber} style={{ color: stockNumberColor }}>
        {stockNumberText}
      </div>
    </div>
    <div className={pickStyle.dataNumber}>
      <div className={pickStyle.number}>
        <div hidden={successPercent <= 0} style={{ width: `${successPercent}%` }}>{received}</div>
        <div hidden={percent <= 0} style={{ width: `${percent}%` }}>{collectable}</div>
        <div hidden={trail <= 0} style={{ width: `${trail}%` }}>{notPrepared}</div>
      </div>
      <Progress
        className={pickStyle.progress}
        format={() => {
          return <span style={{ color: '#000' }}>{item.number + '  (申请数)'}</span>;
        }}
        percent={percent + successPercent}
        success={{ percent: successPercent, strokeColor: receivedColor }}
        trailColor={notPreparedColor}
        strokeColor={collectableColor}
      />
    </div>
  </div>;
};

export default OutSkuItem;
