import React, { useState } from 'react';
import style from './index.less';
import MyEllipsis from '../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';
import { isQiyeWeixin, ToolUtil } from '../../../../util/ToolUtil';
import { useHistory, useLocation } from 'react-router-dom';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import MyAntPopup from '../../../components/MyAntPopup';
import SkuDetail from '../SkuDetail';
import wx from 'weixin-js-sdk';

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
    oneRow,
    backTitle,
    showDetail,
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

  const [openDetail, setOpenDetail] = useState(false);

  const location = useLocation();

  const toDetail = () => {
    if (showDetail) {
      ToolUtil.back({
        key: 'popup',
        title: backTitle,
        onBack: () => {
          setOpenDetail(false);
        },
      });
      setOpenDetail(true);
      return;
    }
    if (!skuResult.skuId || noView || document.getElementsByTagName('body').item(0).classList.contains('adm-overflow-hidden')) {
      return;
    }
    history.push(`/Work/Sku/SkuDetail?skuId=${skuResult.skuId}`);
  };

  const view = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (isQiyeWeixin() && ua.indexOf('windowswechat') === -1) {
      wx.miniProgram.navigateTo({
        // url: `/Sku/SkuDetail/index?skuId=${skuResult.skuId}`,
        url: `/Sku/SkuDetailWebView/index?skuId=${skuResult.skuId}`,
        success: () => {

        },
        fail: () => {
          toDetail();
        },
        complete: () => {

        },
      });
    } else {
      toDetail();
    }
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
        onClick={() => view()}
        className={style.sku}
        style={{
          height: imgSize,
          maxWidth: `calc(${ToolUtil.viewWidth()}px - ${imgSize}px - 13px - ${extraWidth})`,
        }}
      >
        <MyEllipsis width='100%'>
          {title || SkuResultSkuJsons({ skuResult, spu: !oneRow })}
        </MyEllipsis>
        <div hidden={oneRow} className={style.describe}>
          <MyEllipsis width='100%'>
            {describe || SkuResultSkuJsons({ skuResult, sku: true })}
          </MyEllipsis>
        </div>
        <div hidden={otherData.length === 0 || !otherData.some(item => item)}>
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

    <MyAntPopup position='right' visible={openDetail} className={style.skuDetail}>
      <SkuDetail
        show
        backTitle={backTitle}
        id={skuResult.skuId}
      />
    </MyAntPopup>
  </>;
};

export default SkuItem;
