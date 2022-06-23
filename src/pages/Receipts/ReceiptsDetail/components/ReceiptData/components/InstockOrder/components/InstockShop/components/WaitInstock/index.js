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
import { SkuResultSkuJsons } from '../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';

export const sendBack = { url: '/shopCart/sendBack', method: 'POST' };

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

  // 退回
  const { loading: backLoading, run: backRun } = useRequest(sendBack, {
    manual: true,
    onSuccess: () => {
      shopRefresh();
      refresh();
      Message.toast('退回成功！');
    },
    onError: () => {
      Message.toast('退回失败！');
    },
  });

  const instockList = ToolUtil.isArray(shopList).filter(item => item.number > 0);

  const [data, setData] = useState([]);

  const instockSkus = data.filter(item => item.skuResult && item.skuResult.positionsResult && item.skuResult.positionsResult.length > 0);

  const allChecked = data.length === 0 ? false : instockList.length === data.length;

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
        待入 {instockList.length}
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
              const customerName = ToolUtil.isObject(item.customer).customerName || '-';
              const brandName = ToolUtil.isObject(item.brandName).brandName || '-';

              return <div key={index} className={style.skuItem}>
                <LinkButton className={style.check} onClick={() => {
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
                    title={positionsResult ? positionsResult.name + ' / ' + storehouseResult.name : '无库位'}
                    extraWidth='120px'
                    describe={SkuResultSkuJsons({skuResult})}
                    otherData={`${customerName} / ${brandName}`}
                  />
                </div>
                <div className={style.inStock}>
                  <div hidden={item.type !== 'instockByAnomaly'} className={style.error}>异常转入</div>
                  <ShopNumber show value={item.number} />
                  <Button color='primary' fill='outline' onClick={() => {
                    onInstock(item,instockList.length);
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
              setData(instockList);
            }
          }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 种</span>
        </div>
        <div className={style.buttons}>
          <Button color='danger' disabled={data.length === 0} fill='outline' onClick={() => {
            backRun({
              data: { ids: data.map(item => item.cartId) },
            });
          }}>退回</Button>
          <Button color='primary' fill='outline' disabled={instockSkus.length === 0} onClick={() => {
            const listParams = instockSkus.map((item) => {
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

    {(instockLoading || backLoading) && <MyLoading />}
  </>;
};

export default WaitInstock;
