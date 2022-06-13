import React from 'react';
import style from './index.less';
import MyEllipsis from '../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';
import { ToolUtil } from '../../../components/ToolUtil';

const SkuItem = (
  {
    number,
    unitName,
    skuResult = {},
    otherData,
    extraWidth = '0px',
    imgSize = 74,
    gap = 4,
    imgId,
    className,
    otherTop,
    otherDom,
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0];

  const describe = `${
    skuResult.skuJsons
    &&
    skuResult.skuJsons.length > 0
    &&
    skuResult.skuJsons[0].values.attributeValues
    &&
    skuResult.skuJsons.map((items) => {
      return items.values.attributeValues;
    }).join(' / ') || '-'
  }`;

  return <>
    <div className={ToolUtil.classNames(style.skuList, className)}>
      <div id={imgId} className={style.img} style={{ maxHeight: imgSize, minWidth: imgSize }}>
        <img src={imgUrl || state.loginLogo} width={imgSize} height={imgSize} alt='' />
        <div hidden={number === undefined} className={style.number}>{number}{unitName}</div>
      </div>
      <div
        className={style.sku}
        style={{ gap, maxWidth: `calc(100vw - ${imgSize}px - 13px - ${extraWidth})` }}
      >
        <MyEllipsis width='100%'>
          {otherTop ? otherData : SkuResultSkuJsons({ skuResult })}
        </MyEllipsis>
        <div className={style.describe}>
          <MyEllipsis width='100%'>
            {otherTop ? SkuResultSkuJsons({ skuResult }) : describe}
          </MyEllipsis>
        </div>
        <div>
          {otherDom || <div hidden={otherTop ? describe === '-' : !otherData} className={style.otherData}>
            <MyEllipsis width='100%'>
              {otherTop ? describe : otherData}
            </MyEllipsis>
          </div>}
        </div>
      </div>
    </div>
  </>;
};

export default SkuItem;
