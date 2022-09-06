import React from 'react';
import style from './index.less';
import MyEllipsis from '../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';
import { ToolUtil } from '../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutline, ExclamationOutline, ExclamationTriangleOutline } from 'antd-mobile-icons';

const SkuItem = (
  {
    hiddenNumber,
    number,
    unitName,
    skuResult = {},
    otherData = [],
    extraWidth = '0px',
    imgSize = 74,
    imgId,
    className,
    describe,
    title,
    more,
    moreDom,
    noView,
    moreClick = () => {
    },
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  const spuResult = skuResult.spuResult || {};
  const unitResult = spuResult.unitResult || {};

  const history = useHistory();

  const view = () => {
    if (noView || document.getElementsByTagName('body').item(0).classList.contains('adm-overflow-hidden')) {
      return;
    }
    history.push(`/Work/Sku/SkuDetail?skuId=${skuResult.skuId}`);
  };
  const getStockNumber = () => {
    const stockNumber = (skuResult.stockNumber || 0) - (skuResult.lockStockDetailNumber || 0);
    return typeof number === 'number' ? number : stockNumber;
  };

  return <>
    <div className={ToolUtil.classNames(style.skuList, className)}>
      <div id={imgId} className={style.img} style={{ maxHeight: imgSize, minWidth: imgSize }} onClick={view}>
        <img src={imgUrl || state.imgLogo} width={imgSize} height={imgSize} alt='' />
        <div hidden={hiddenNumber} className={style.number}>
          {getStockNumber()}{unitName || unitResult.unitName}
          {skuResult.lockStockDetailNumber > 0 && <span className={style.error}>
          <ExclamationTriangleOutline />
          </span>}
        </div>
      </div>
      <div
        className={style.sku}
        style={{ maxWidth: `calc(${ToolUtil.viewWidth()}px - ${imgSize}px - 13px - ${extraWidth})` }}
      >
        <MyEllipsis width='100%'>
          {title || SkuResultSkuJsons({ skuResult, spu: true })}
        </MyEllipsis>
        <div className={style.describe}>
          <MyEllipsis width='100%'>
            {describe || SkuResultSkuJsons({ skuResult, sku: true })}
          </MyEllipsis>
        </div>
        <div hidden={otherData.length === 0}>
          {
            otherData.map((item, index) => {
              if (!item) {
                return null;
              }
              return <div key={index} className={style.otherData}>
                {typeof item === 'string' ? <MyEllipsis width='100%'>
                  {item}
                </MyEllipsis> : item}
              </div>;
            })
          }
        </div>
      </div>
    </div>
    {moreDom || <div
      hidden={!more}
      className={style.more}
      style={{ maxWidth: `calc(${ToolUtil.viewWidth()} - 13px - ${extraWidth})` }}
      onClick={moreClick}
    >
      <MyEllipsis width='100%'>
        {more}
      </MyEllipsis>
    </div>}
  </>;
};

export default SkuItem;
