import React, { useRef, useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import ShopNumber from '../../../../../../../../Work/AddShop/components/ShopNumber';
import { ScanIcon } from '../../../../../../../../components/Icon';
import LinkButton from '../../../../../../../../components/LinkButton';
import { Message } from '../../../../../../../../components/Message';
import Order from './components/Order';
import { useRequest } from '../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../../components/BottomButton';
import { useModel } from 'umi';

const cartAdd = { url: '/productionPickListsCart/add', method: 'POST' };

const Prepare = (
  {
    id,
    skuItem = {},
    onClose = () => {
    },
    onSuccess = () => {
    },
    taskId,
    allocation,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const outStockNumber = allocation ? skuItem.number : skuItem.number - parseInt(skuItem.receivedNumber || 0) - skuItem.perpareNumber;

  const [outStockSkus, setOutStockSkus] = useState([]);

  const skuResult = skuItem.skuResult || {};

  const inkindRef = useRef();

  const addShopCart = (
    imgUrl,
    imgId,
    transitionEnd = () => {
    }) => {

    const skuImg = document.getElementById(imgId);
    if (!skuImg) {
      transitionEnd();
      return;
    }
    const top = skuImg.getBoundingClientRect().top;
    const left = skuImg.getBoundingClientRect().left;
    ToolUtil.createBall({
      top: top > 0 ? top : 0,
      left,
      imgUrl,
      transitionEnd,
      getNodePosition: () => {
        const waitInstock = document.getElementById('pickShop');
        const parent = waitInstock.offsetParent;
        const translates = document.defaultView.getComputedStyle(parent, null).transform;
        let translateX = parseFloat(translates.substring(6).split(',')[4]);
        let tanslateY = parseFloat(translates.substring(6).split(',')[5]);
        return {
          top: parent.offsetTop + tanslateY,
          left: parent.offsetLeft + translateX,
        };
      },
    });
  };

  const addShop = () => {
    onClose();
    const imgUrl = ToolUtil.isArray(skuResult.imgResults)[0]?.thumbUrl || state.homeLogo;
    addShopCart(imgUrl, 'pickSkuImg');
    let number = 0;
    outStockSkus.forEach(item => number += item.number);
    onSuccess({ ...skuItem, number });
  };


  const { loading, run: addCart } = useRequest(cartAdd, {
    response: true,
    manual: true,
    onSuccess: (res) => {
      if (res.errCode === 1001) {
        Message.warningDialog({
          only: false,
          content: '本次操作会影响其他出库单相同物料备料!',
          confirmText: '继续备料',
          cancelText: '取消备料',
          onConfirm: () => {
            addCart({ data: { productionPickListsCartParams: outStockSkus, taskId, warning: true } });
          },
        });
      } else {
        addShop();
      }
    },
  });

  return <>

    <div className={style.header}>
      {allocation ? '调拨' : '备料'}
    </div>

    <div
      className={style.skuItem}
    >
      <div className={style.item}>
        <SkuItem
          imgId='pickSkuImg'
          number={skuItem.stockNumber}
          skuResult={skuResult}
          extraWidth='124px'
          otherData={[
            ToolUtil.isObject(skuItem.brandResult).brandName || '任意品牌',
            allocation && skuItem.positionName,
          ]}
        />
      </div>
      <div className={style.scan}>
        <ShopNumber value={outStockNumber} show />
        <LinkButton onClick={() => {
          inkindRef.current.open({
            skuId: skuItem.skuId,
            brandId: skuItem.brandId,
            positionId: allocation && skuItem.positionId,
            skuResult,
          });
        }}><ScanIcon style={{ fontSize: 24 }} /></LinkButton>
      </div>
    </div>
    <div style={{ paddingBottom: 60 }}>
      <Order
        allocation={allocation}
        storehousePositionsId={allocation && skuItem.positionId}
        inkindRef={inkindRef}
        customerId={skuItem.customerId}
        brandId={allocation ? skuItem.brandId : skuItem.brandId && !['0', 0].includes(skuItem.brandId) ? skuItem.brandId : null}
        id={id}
        pickListsDetailId={skuItem.pickListsDetailId}
        skuId={skuItem.skuId}
        outStockNumber={outStockNumber}
        onChange={(array) => {
          setOutStockSkus(array);
        }}
      />
    </div>

    <BottomButton
      leftOnClick={onClose}
      rightDisabled={outStockSkus.length === 0}
      rightText='确定'
      rightOnClick={() => {
        if (allocation) {
          onSuccess(outStockSkus);
          return;
        }
        addCart({ data: { productionPickListsCartParams: outStockSkus, taskId } });
      }}
    />

    {loading && <MyLoading />}
  </>;
};

export default Prepare;
