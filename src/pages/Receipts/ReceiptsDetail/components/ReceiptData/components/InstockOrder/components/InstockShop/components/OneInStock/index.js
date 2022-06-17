import React, { useState } from 'react';
import style from '../../index.less';
import { CloseCircleOutline, CloseOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { Button, Popup, Stepper } from 'antd-mobile';
import { Message } from '../../../../../../../../../../components/Message';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import Positions from '../Positions';

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

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/inStockByOrder',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Message.toast('入库成功！');
      refresh();
      onClose();
    },
    onError: () => {
      Message.toast('入库失败！');
    },
  });

  const [positions, setPositions] = useState([]);

  const inStockSku = positions.filter(item => item.number > 0);

  const [visible, setVisible] = useState();

  const positionResults = (data, array = [], item) => {
    if (!Array.isArray(data)) {
      return item ? array.push({ name: item.title, id: item.key }) : [];
    }
    data.map((item) => {
      return positionResults(item.loops, array, item);
    });
    return array;
  };

  const { loading: getPositionsLoading } = useRequest(
    { ...getPositionsBySkuIds, data: { skuIds: [skuItem.skuId] } },
    {
      onSuccess: (res) => {
        const results = positionResults(res);
        if (results.length === 1) {
          results[0] = { ...results[0], number: skuItem.number };
        }
        setPositions(results);
      },
    });

  return <div className={style.content} style={{ height: 'auto', padding: '0 12px 76px' }}>
    <div className={style.header}>
      物料入库
      <span onClick={() => {
        onClose();
      }}><CloseOutline /></span>
    </div>
    <div className={style.skuList} style={{ borderBottom: '1px solid #EEEEEE' }}>
      <div className={style.skuItem}>
        <div className={style.sku}>
          <SkuItem
            skuResult={skuResult}
            extraWidth='120px'
            otherData={ToolUtil.isObject(skuItem.customer).customerName}
          />
        </div>
        <div className={style.inStock} style={{ justifyContent: 'center' }}>
          <div>
            <ShopNumber show value={skuItem.number} />
          </div>
        </div>
      </div>
    </div>
    <div className={style.position}>
      {
        getPositionsLoading ?
          <MyLoading skeleton title='正在获取库位信息，请稍后...' />
          :
          positions.map((item, index) => {
            return <div key={index} className={style.positionItem}>

              <div className={style.action}>
                <CloseCircleOutline onClick={() => {
                  setPositions(positions.filter((item, currentIndex) => currentIndex !== index));
                }} />
                {item.name}
              </div>

              <Stepper
                min={0}
                style={{
                  '--button-text-color': '#000',
                }}
                value={item.number || 0}
                onChange={(number) => {
                  let allNumber = 0;
                  const newPositions = positions.map((item, currentIndex) => {
                    if (currentIndex === index) {
                      return { ...item, number };
                    }
                    allNumber += (item.number || 0);
                    return item;
                  });
                  if ((number + allNumber) > skuItem.number) {
                    return Message.toast('不能超过申请数量!');
                  } else {
                    setPositions(newPositions);
                  }
                }}
              />
            </div>;
          })
      }
    </div>

    <Button
      className={style.addPositions}
      color='primary'
      fill='outline'
      onClick={() => {
        setVisible(true);
      }}
    >添加库位</Button>

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

    <Popup visible={visible}>
      <Positions
        onClose={() => setVisible(false)}
        onSuccess={(value) => {
          setVisible(false);
          setPositions([...positions, value]);
        }} />
    </Popup>

    {instockLoading && <MyLoading />}

  </div>;
};

export default OneInStock;
