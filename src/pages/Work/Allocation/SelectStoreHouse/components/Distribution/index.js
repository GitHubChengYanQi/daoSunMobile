import React, { useState } from 'react';
import { Button, Picker, Popup } from 'antd-mobile';
import ShopNumber from '../../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import style from './index.less';
import SkuItem from '../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../components/ToolUtil';
import BottomButton from '../../../../../components/BottomButton';
import { useRequest } from '../../../../../../util/Request';
import Positions
  from '../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { MyLoading } from '../../../../../components/MyLoading';
import MyPositions from '../../../../../components/MyPositions';

export const allocationCartAdd = { url: '/allocationCart/add', method: 'POST' };

const Distribution = (
  {
    skuItem,
    out,
    onClose = () => {
    },
    refresh = () => {
    },
  },
) => {

  const brands = ToolUtil.isArray(skuItem.brandResults);

  const [dataVisible, setDataVisible] = useState();

  const [data, setData] = useState({
    number: skuItem.number,
    brandId: skuItem.brandId,
    outPosition: {
      id: ToolUtil.isObject(skuItem.positionsResult).storehousePositionsId,
      name: ToolUtil.isObject(skuItem.positionsResult).name,
      storehouseId: skuItem.storehouseId,
    },
    inPosition: {
      id: ToolUtil.isObject(skuItem.toPositionsResult).storehousePositionsId,
      name: ToolUtil.isObject(skuItem.toPositionsResult).name,
      storehouseId: skuItem.toStorehouseId,
    },
  });

  const { loading, run } = useRequest(allocationCartAdd, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <div className={style.content}>
    <SkuItem
      className={style.sku}
      skuResult={skuItem.skuResult}
      otherData={[ToolUtil.isObject(skuItem.brandResult).brandName || '任意品牌']}
    />
    <div hidden={!out} className={style.flex}>
      <div className={style.label}>调出库位</div>
      <Button color='primary' fill='outline' onClick={() => {
        setDataVisible('outPosition');
      }}>
        {data.outPosition.name || '请选择库位'}
      </Button>
    </div>
    <div hidden={out} className={style.flex}>
      <div className={style.label}>调入库位</div>
      <Button color='primary' fill='outline' onClick={() => {
        setDataVisible('inPosition');
      }}>
        {data.inPosition.name || '请选择库位'}
      </Button>
    </div>
    <div hidden={skuItem.brandId} className={style.flex}>
      <div className={style.label}>品牌</div>
      <Button disabled={brands.length === 0} color='primary' fill='outline'>
        {data.brandName || '任意品牌'}
      </Button>
    </div>
    <div className={style.flex}>
      <div className={style.label}>数量</div>
      <ShopNumber max={skuItem.number} min={1} value={data.number} onChange={number => {
        setData({ ...data, number });
      }} />
    </div>

    <Picker
      destroyOnClose
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[[{ label: '任意品牌', value: 0 }, ...brands.map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      })]]}
      visible={dataVisible === 'brand'}
      onClose={() => {
        setDataVisible(null);
      }}
      value={[data.brandId]}
      onConfirm={(value, options) => {
        const brand = ToolUtil.isArray(options.items)[0] || {};
        setData({
          ...data,
          brandId: brand.value,
          brandName: brand.label,
        });
      }}
    />

    <MyPositions
      visible={['outPosition', 'inPosition'].includes(dataVisible)}
      single
      value={dataVisible === 'outPosition' ? (data.outPosition && [data.outPosition]) : (data.inPosition && [data.inPosition])}
      onClose={() => setDataVisible(null)}
      onSuccess={(value = []) => {
        const position = value[0] || {};
        if (dataVisible === 'outPosition') {
          setData({
            ...data,
            outPosition: position,
          });
        } else {
          setData({
            ...data,
            inPosition: position,
          });
        }
        setDataVisible(null);
      }} />

    <BottomButton
      rightDisabled={out ? !data.outPosition.id : !data.inPosition.id}
      leftOnClick={onClose}
      rightOnClick={() => {
        run({
          data: {
            ...skuItem,
            storehousePositionsId: data.outPosition.id,
            storehouseId: data.outPosition.storehouseId,
            toStorehousePositionsId: data.inPosition.id,
            toStorehouseId: data.inPosition.storehouseId,
            brandId: data.brandId,
            number: data.number,
          },
        });
      }}
    />
  </div>;
};

export default Distribution;
