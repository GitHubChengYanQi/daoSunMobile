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
    extraWidth = '0px',
    imgSize = 74,
    gap = 4,
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  return <>
    <div className={style.skuList}>
      <div className={style.img} style={{ maxHeight: imgSize, minWidth: imgSize }}>
        <img src={imgUrl || state.loginLogo} width={imgSize} height={imgSize} alt='' />
        <div hidden={number === undefined} className={style.number}>{number}{unitName}</div>
      </div>
      <div
        className={style.sku}
        style={{ gap, maxWidth: `calc(100vw - ${imgSize}px - 13px - ${extraWidth})` }}
      >
        <MyEllipsis width='100%'><SkuResultSkuJsons skuResult={skuResult} /></MyEllipsis>
        <div className={style.describe}>
          <MyEllipsis width='100%'>
            {
              `${
                skuResult.skuJsons
                &&
                skuResult.skuJsons.length > 0
                &&
                skuResult.skuJsons[0].values.attributeValues
                &&
                skuResult.skuJsons.map((items) => {
                  return items.values.attributeValues;
                }).join(' / ') || '--'
              }`
            }
          </MyEllipsis>
        </div>
        <div className={style.otherDataStyle}>
          <div hidden={!otherData} className={style.otherData}>
            <MyEllipsis width='100%'>{otherData}</MyEllipsis>
          </div>
        </div>

      </div>
    </div>
  </>;
};

export default SkuItem;
