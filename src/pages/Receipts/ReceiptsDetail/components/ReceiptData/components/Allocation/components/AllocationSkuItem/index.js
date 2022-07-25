import React from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import moment from 'moment';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { PositionShow } from '../PositionShow';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const AllocationSkuItem = (
  {
    item,
  },
) => {

  const cartId = item.allocationCartId;

  const outPosition = ToolUtil.isObject(item.positionsResult).name;
  const inPosition = ToolUtil.isObject(item.toPositionsResult).name;

  let complete;

  let text;

  if (cartId) {
    complete = item.status === 98;
    text = item.storehouseId === item.toStorehouseId ? '库内' : '库间';
  }

  return <div
    className={style.sku}
  >
    <div
      className={ToolUtil.classNames(
        style.skuItem,
        complete && style.inStockSkuItem,
      )}
    >
      <div hidden={!complete} className={ToolUtil.classNames(style.infoLogo)}>
        <span>{moment(item.createTime).format('YYYY-MM-DD')}</span>
      </div>
      <div className={style.item}>
        <SkuItem
          skuResult={item.skuResult}
          otherData={[
            item.brandName || '任意品牌',
            <PositionShow outPositionName={outPosition} inPositionName={inPosition} />,
          ]} />
      </div>
      <div className={style.skuNumber} style={{ padding: !complete && 0 }}>
        <div className={style.success}>
          {text}
        </div>
        <ShopNumber value={item.number} show />
      </div>
    </div>
  </div>;
};

export default AllocationSkuItem;
