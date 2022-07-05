import React, { useEffect, useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import Icon from '../../../../../../../../components/Icon';
import LinkButton from '../../../../../../../../components/LinkButton';
import { connect } from 'dva';
import { Message } from '../../../../../../../../components/Message';
import Order from './components/Order';
import { useRequest } from '../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../../components/BottomButton';
import { Dialog } from 'antd-mobile';

const cartAdd = { url: '/productionPickListsCart/add', method: 'POST' };

const Prepare = (
  {
    id,
    skuItem = {},
    dimension,
    onClose = () => {
    },
    onSuccess = () => {
    },
    ...props
  },
) => {

  const outStockNumber = skuItem.number - parseInt(skuItem.receivedNumber || 0) - skuItem.perpareNumber;


  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  const [codeData, setCodeData] = useState();

  const [outStockSkus, setOutStockSkus] = useState([]);

  const { loading, run: addCart } = useRequest(cartAdd, {
    response: true,
    manual: true,
    onSuccess: (res) => {
      if (res.errCode === 1001) {
        Dialog.confirm({
          content: '本次操作会影响其他出库单相同物料备料!',
          confirmText: '继续备料',
          cancelText: '取消备料',
          onConfirm: () => {
            addCart({ data: { productionPickListsCartParams: outStockSkus, warning: false } });
          },
        });
      }else {
        Message.toast('备料成功！');
        onSuccess();
      }
    },
    onError: (res) => {
      Message.toast('备料失败！');
    },
  });

  useEffect(() => {
    if (codeId) {
      props.dispatch({ type: 'qrCode/clearCode' });
      const inkind = ToolUtil.isObject(backObject.inkindResult);
      if (backObject.type === 'item' && inkind.skuId === skuItem.skuId && (skuItem.brandId ? skuItem.brandId === inkind.brandId : true)) {
        const inkindDetail = ToolUtil.isObject(inkind.inkindDetail);
        setCodeData({
          positionId: ToolUtil.isObject(inkindDetail.storehousePositions).storehousePositionsId,
          brandId: ToolUtil.isObject(inkindDetail.brand).brandId,
          number: inkind.number,
        });
      } else {
        Message.toast('请扫描正确的实物码！');
      }
    }
  }, [codeId]);


  const dimensionAction = () => {
    switch (dimension) {
      case 'order':
        return <Order
          codeData={codeData}
          customerId={skuItem.customerId}
          brandId={skuItem.brandId && skuItem.brandId !== '0' ? skuItem.brandId : null}
          id={id}
          pickListsDetailId={skuItem.pickListsDetailId}
          skuId={skuItem.skuId}
          outStockNumber={outStockNumber}
          onChange={(array) => {
            setOutStockSkus(array);
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>

    <div className={style.header}>
      备料
    </div>

    <div
      className={style.skuItem}
    >
      <div className={style.item}>
        <SkuItem
          number={skuItem.stockNumber}
          imgSize={60}
          skuResult={skuItem.skuResult}
          extraWidth='124px'
          otherData={[ToolUtil.isObject(skuItem.brandResult).brandName || '任意品牌']}
        />
      </div>
      <div className={style.scan}>
        <ShopNumber value={outStockNumber} show />
        <LinkButton onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'outStock',
            },
          });
        }}><Icon type='icon-dibudaohang-saoma' style={{ fontSize: 24 }} /></LinkButton>
      </div>
    </div>
    <div style={{ paddingBottom: 60 }}>
      {dimensionAction()}
    </div>

    <BottomButton
      leftOnClick={onClose}
      rightDisabled={outStockSkus.length === 0}
      rightText='确定'
      rightOnClick={() => {
        addCart({ data: { productionPickListsCartParams: outStockSkus } });
      }}
    />

    {loading && <MyLoading />}
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Prepare);
