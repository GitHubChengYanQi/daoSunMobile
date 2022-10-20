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

  return <>
    <div className={style.space} />
    <div className={style.skuInfo}>
      <SkuItem noView skuResult={sku} otherData={[<>保养周期：{sku.time ? `${sku.time}天` : '暂无'}</>]} />
    </div>
    <div className={style.space} />
  </>;
};

export default SkuInfo;
