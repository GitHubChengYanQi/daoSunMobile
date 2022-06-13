import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { CloseOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Button } from 'antd-mobile';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { shopCartAllList } from '../../../../../../../../../../Work/Instock/Url';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import { Message } from '../../../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';

const WaitInstock = (
  {
    refresh,
    actionId,
    instockOrderId,
    onClose = () => {
    },
    onInstock = () => {
    },
  }) => {

  const {
    loading,
    data: shopList,
    run: showShop,
    refresh: shopRefresh,
  } = useRequest(shopCartAllList, { manual: true });

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/inStockByOrder',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      shopRefresh();
      refresh();
      Message.toast('入库成功！');
    },
    onError: () => {
      Message.toast('入库失败！');
    },
  });

  const instockList = ToolUtil.isArray(shopList).filter(item => item.number > 0);

  const [data, setData] = useState([]);

  const skus = instockList.filter(item => item.skuResult && item.skuResult.positionsResult && item.skuResult.positionsResult.length > 0);

  const allChecked = skus.length === data.length;

  const check = (checked, item) => {
    if (!checked) {
      setData([...data, item]);
    } else {
      setData(data.filter(currentItem => currentItem.cartId !== item.cartId));
    }
  };

  useEffect(() => {
    showShop({ data: { types: ['instockByAnomaly', 'waitInStock'], sourceId: instockOrderId } });
  }, []);

  return <>
    <div className={style.content}>
      <div className={style.header}>
        待入物料
        <span onClick={() => {
          onClose();
        }}><CloseOutline /></span>
      </div>
      <div className={style.screen}>
        待入 {skus.length}
      </div>
      <div className={style.skuList}>
        {loading ? <MyLoading skeleton /> : <>
          {instockList.length === 0 && <MyEmpty description='暂无待入物料' />}
          {
            instockList.map((item, index) => {

              const checked = data.map(item => item.cartId).includes(item.cartId);

              const skuResult = item.skuResult || {};
              const positionsResult = ToolUtil.isArray(skuResult.positionsResult)[0];
              const storehouseResult = positionsResult && positionsResult.storehouseResult || {};

              return <div key={index} className={style.skuItem}>
                <LinkButton disabled={!positionsResult} className={style.check} onClick={() => {
                  check(checked, item);
                }}>
                  <MyCheck checked={checked} />
                </LinkButton>
                <div className={style.sku} onClick={() => {
                  if (!positionsResult) {
                    return;
                  }
                  check(checked, item);
                }}>
                  <SkuItem
                    otherTop
                    skuResult={item.skuResult}
                    extraWidth='120px'
                    otherData={positionsResult ? positionsResult.name + ' / ' + storehouseResult.name : '无库位'}
                  />
                </div>
                <div className={style.inStock}>
                  <ShopNumber show value={item.number} />
                  <Button color='primary' fill='outline' onClick={() => {
                    onInstock(item);
                  }}>入库</Button>
                </div>
              </div>;
            })
          }
        </>}
      </div>


      <div className={style.bottom}>
        <div className={style.all}>
          <MyCheck checked={allChecked} onChange={() => {
            if (allChecked) {
              setData([]);
            } else {
              setData(skus);
            }
          }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 种</span>
        </div>
        <div className={style.buttons}>
          <Button color='danger' fill='outline'>退回</Button>
          <Button color='primary' fill='outline' disabled={data.length === 0} onClick={() => {
            const listParams = data.map((item) => {
              const skuResult = ToolUtil.isObject(item.skuResult);
              const positionsResult = ToolUtil.isArray(skuResult.positionsResult)[0] || {};
              const batch = ToolUtil.isObject(item.skuResult).batch === 1;
              return {
                type: item.type,
                shopCartId: item.cartId,
                skuId: item.skuId,
                customerId: item.customerId,
                brandId: item.brandId,
                number: item.number,
                storehousePositionsId: positionsResult.storehousePositionsId,
                instockListId: item.formId,
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
          }}>提交</Button>
        </div>
      </div>
    </div>

    {instockLoading && <MyLoading />}
  </>;
};

export default WaitInstock;
