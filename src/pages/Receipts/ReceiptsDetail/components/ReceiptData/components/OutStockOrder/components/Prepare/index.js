import React, { useEffect, useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';
import Icon from '../../../../../../../../components/Icon';
import LinkButton from '../../../../../../../../components/LinkButton';
import { connect } from 'dva';
import { Message } from '../../../../../../../../components/Message';
import Order from './components/Order';
import { useRequest } from '../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../components/MyLoading';

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

  const outStockNumber = skuItem.number - parseInt(skuItem.receivedNumber || 0) - skuItem.perpareNumber


  const codeId = ToolUtil.isObject(props.qrCode).codeId;
  const backObject = ToolUtil.isObject(props.qrCode).backObject || {};

  const [codeData, setCodeData] = useState();

  const [outStockSkus, setOutStockSkus] = useState([]);
  console.log(outStockSkus);

  const { loading, run: addCart } = useRequest(cartAdd, {
    manual: true,
    onSuccess: () => {
      Message.toast('添加成功！');
      onSuccess();
    },
    onError: () => {
      Message.toast('添加失败！');
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
          number={ToolUtil.isObject(skuItem.skuResult).stockNumber}
          imgSize={60}
          skuResult={skuItem.skuResult}
          extraWidth='124px'
          otherData={ToolUtil.isObject(skuItem.bradnResult).brandName}
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
    {dimensionAction()}
    <div className={style.bottom}>
      <Button className={style.close} onClick={onClose}>取消</Button>
      <Button disabled={outStockSkus.length === 0} className={style.ok} onClick={() => {
        addCart({ data: { productionPickListsCartParams: outStockSkus } });
      }}>确定</Button>
    </div>

    {loading && <MyLoading />}
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Prepare);
