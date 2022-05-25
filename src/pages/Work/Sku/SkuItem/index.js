import React from 'react';
import style from './index.less';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';

const SkuItem = (
  {
    number,
    unitName,
    skuResult = {},
    otherData,
    extraWidth = 0,
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  return <>
    <div className={style.skuList}>
      <div className={style.img}>
        <img src={imgUrl || state.loginLogo} width={74} height={74} alt='' />
        <div hidden={number === undefined} className={style.number}>{number}{unitName}</div>
      </div>
      <div className={style.sku} style={{ maxWidth: `calc(100vw - 74px - 12px - 13px - 29px - ${extraWidth}px)` }}>
        <MyEllipsis width='100%'><SkuResultSkuJsons skuResult={skuResult} /></MyEllipsis>
        <div className={style.describe}>
          <MyEllipsis width='100%'><SkuResultSkuJsons skuResult={skuResult} describe /></MyEllipsis>
        </div>
        <div hidden={!otherData} className={style.otherData}>
          <MyEllipsis width='100%'>{otherData}</MyEllipsis>
        </div>
      </div>
    </div>
  </>;
};

export default SkuItem;
