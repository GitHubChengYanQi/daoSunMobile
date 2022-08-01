import React from 'react';
import SkuItem from '../../../../Work/Sku/SkuItem';
import style from './index.less';

const SkuInfo = (
  {
    sku = {},
  },
) => {

  if (!sku) {
    return <></>;
  }

  return <div className={style.skuInfo}>
    <SkuItem skuResult={sku} otherData={[`保养周期：${sku.time || 0}天`]} />
  </div>;
};

export default SkuInfo;
