import React, { useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import moment from 'moment';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import LinkButton from '../../../../../../../../components/LinkButton';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import View from './components/View';

const AllocationSkuItem = (
  {
    item,
    out,
  },
) => {

  const brands = item.brands || [];

  const [view, setView] = useState();

  return <div
    className={style.sku}
  >
    <div
      className={ToolUtil.classNames(
        style.skuItem,
        // complete && style.inStockSkuItem,
      )}
    >
      <div hidden className={ToolUtil.classNames(style.infoLogo)}>
        <span>{moment(item.createTime).format('YYYY-MM-DD')}</span>
      </div>
      <div className={style.item}>
        <SkuItem
          extraWidth='124px'
          skuResult={item.skuResult}
          otherData={[
            item.haveBrand ? brands.map(item => item.brandName).join(' / ') : '任意品牌',
            <LinkButton onClick={() => setView(true)}>查看详情</LinkButton>,
          ]} />
      </div>
      <div className={style.skuNumber} style={{ padding: 0 }}>
        <div className={style.success}>
          {/*{text}*/}
        </div>
        <ShopNumber value={item.number} show />
      </div>
    </div>

    <MyAntPopup title='申请详情' visible={view} onClose={() => setView(false)}>
      <View out={out} sku={item} />
    </MyAntPopup>
  </div>;
};

export default AllocationSkuItem;
