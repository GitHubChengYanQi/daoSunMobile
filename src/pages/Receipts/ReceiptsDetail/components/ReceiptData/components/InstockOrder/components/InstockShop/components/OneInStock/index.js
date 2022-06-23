import React, { useState } from 'react';
import style from '../../index.less';
import { CloseOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../../components/Message';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import AddPosition from './AddPosition';

export const getPositionsBySkuIds = { url: '/storehousePositions/treeViewBySku', method: 'POST' };

const OneInStock = (
  {
    refresh,
    actionId,
    instockOrderId,
    onClose = () => {
    },
    skuItem,
  },
) => {

  const skuResult = skuItem.skuResult || {};
  const batch = skuResult.batch === 1;

  const [positions, setPositions] = useState([]);

  const inStockSku = positions.filter(item => item.number > 0);

  let skuNumber = skuItem.number;
  let total = 0;
  positions.map(item => {
    total += item.number;
    return skuNumber -= (item.number || 0);
  });

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/inStockByOrder',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Message.toast('入库成功！');
      refresh();
      onClose(total === skuItem.number);
    },
    onError: () => {
      Message.toast('入库失败！');
    },
  });

  return <div className={style.content} style={{ height: 'auto', padding: '0 12px 76px' }}>
    <div className={style.header}>
      物料入库
      <span onClick={() => {
        onClose(false);
      }}><CloseOutline /></span>
    </div>
    <div className={style.skuList} style={{ borderBottom: '1px solid #EEEEEE' }}>
      <div className={style.skuItem}>
        <div className={style.sku}>
          <SkuItem
            skuResult={skuResult}
            extraWidth='120px'
            otherData={`${ToolUtil.isObject(skuItem.customer).customerName || '-'} / ${ToolUtil.isObject(skuItem.brandResult).brandName}`}
          />
        </div>
        <div className={style.inStock} style={{ justifyContent: 'center' }}>
          <div>
            <ShopNumber show value={skuItem.number} />
          </div>
        </div>
      </div>
    </div>

    <AddPosition
      skuId={skuItem.skuId}
      positions={positions}
      setPositions={setPositions}
      skuNumber={skuNumber}
      total={skuItem.number}
    />


    <BottomButton
      only
      disabled={inStockSku.length === 0}
      text='确认'
      onClick={() => {

        const listParams = inStockSku.map((item) => {
          return {
            type: skuItem.type,
            shopCartId: skuItem.cartId,
            skuId: skuItem.skuId,
            customerId: skuItem.customerId,
            brandId: skuItem.brandId,
            number: item.number,
            storehousePositionsId: item.id,
            instockListId: skuItem.formId,
            batch,
          };
        });

        instockRun({
          data: {
            actionId,
            instockOrderId,
            listParams,
          },
        });
      }}
    />


    {instockLoading && <MyLoading />}

  </div>;
};

export default OneInStock;
