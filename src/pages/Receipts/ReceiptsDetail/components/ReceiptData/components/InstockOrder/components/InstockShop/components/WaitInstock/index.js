import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { CloseOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Button, Popup } from 'antd-mobile';
import ShopNumber from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { shopCartAllList } from '../../../../../../../../../../Work/Instock/Url';
import { Message } from '../../../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import { SkuResultSkuJsons } from '../../../../../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { ReceiptsEnums } from '../../../../../../../../../index';
import Positions from '../Positions';
import LinkButton from '../../../../../../../../../../components/LinkButton';

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

  const [instockList, setInstockList] = useState([]);

  const {
    loading,
    run: showShop,
    refresh: shopRefresh,
  } = useRequest(shopCartAllList, {
    manual: true,
    onSuccess: (res) => {
      const newInstockList = [];
      ToolUtil.isArray(res).map((item) => {
        if (item.number <= 0) {
          return null;
        }
        const instocks = instockList.filter(inItem => inItem.cartId === item.cartId);
        if (instocks.length > 0) {
          newInstockList.push({ ...instocks[0], checked: false });
        } else {
          newInstockList.push({ ...item, checked: false });
        }
        return null;
      });
      setInstockList(newInstockList);
    },
  });

  // 入库
  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/inStockByOrder',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Message.successToast('入库成功！',()=>{
        shopRefresh();
        refresh();
      });
    },
  });

  // 退回
  const { loading: backLoading, run: backRun } = useRequest(sendBack, {
    manual: true,
    onSuccess: () => {
      Message.successToast('退回成功！',()=>{
        shopRefresh();
        refresh();
      });
    },
  });


  const [visible, setVisible] = useState();

  const inStockChecked = instockList.filter(item => item.checked);

  const instockSkus = inStockChecked.filter(item => item.skuResult && item.skuResult.positionsResult && item.skuResult.positionsResult.length > 0);

  const backSkus = inStockChecked.filter(item=>item.type !== 'instockByAnomaly');

  const allChecked = inStockChecked.length === 0 ? false : instockList.length === inStockChecked.length;

  const check = (checked, currentIndex) => {
    const newInStockList = instockList.map((item, index) => {
      if (currentIndex === index) {
        return { ...item, checked: !checked };
      } else {
        return item;
      }
    });
    setInstockList(newInStockList);
  };

  useEffect(() => {
    showShop({
      data: {
        receiptsEnum: ReceiptsEnums.instockOrder,
        types: ['instockByAnomaly', 'waitInStock'],
        sourceId: instockOrderId,
      },
    });
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
        数量：{instockList.length} 类
      </div>
      <div className={style.skuList}>
        {loading ? <MyLoading skeleton /> : <>
          {instockList.length === 0 && <MyEmpty description='暂无待入物料' />}
          {
            instockList.map((item, index) => {

              const checked = item.checked;

              const skuResult = item.skuResult || {};
              const positionsResult = ToolUtil.isArray(skuResult.positionsResult)[0];
              const storehouseResult = positionsResult && positionsResult.storehouseResult || {};
              const customerName = ToolUtil.isObject(item.customer).customerName || '-';
              const brandName = ToolUtil.isObject(item.brandName).brandName  || '无品牌';

              return <div key={index} className={style.skuItem}>
                <MyCheck checked={checked} className={style.check} onChange={() => {
                  check(checked, index);
                }} />
                <div className={style.sku} onClick={() => {
                  if (positionsResult){
                    return;
                  }
                  setVisible(item);
                }}>
                  <SkuItem
                    skuResult={skuResult}
                    title={positionsResult ?
                      (positionsResult.name || '') + `${(positionsResult.name && storehouseResult.name) ? '/' : ''}` + (storehouseResult.name || '') :
                      <LinkButton>请选择库位</LinkButton>
                    }
                    extraWidth='120px'
                    describe={SkuResultSkuJsons({ skuResult })}
                    otherData={[customerName, brandName]}
                  />
                </div>
                <div className={style.inStock}>
                  <div hidden={item.type !== 'instockByAnomaly'} className={style.error}>异常转入</div>
                  <ShopNumber show value={item.number} />
                  <Button color='primary' fill='outline' onClick={() => {
                    onInstock(item, instockList.length);
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
            setInstockList(instockList.map(item => {
              return { ...item, checked: !allChecked };
            }));
          }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {inStockChecked.length} 类</span>
        </div>
        <div className={style.buttons}>
          <Button color='danger' disabled={backSkus.length === 0} fill='outline' onClick={() => {
            backRun({
              data: { ids: backSkus.map(item => item.cartId) },
            });
          }}>退回</Button>
          <Button color='primary' disabled={instockSkus.length === 0} onClick={() => {
            const listParams = instockSkus.map((item) => {
              const skuResult = ToolUtil.isObject(item.skuResult);
              const positionsResult = ToolUtil.isArray(skuResult.positionsResult)[0] || {};
              const batch = ToolUtil.isObject(item.skuResult).batch === 1;
              return {
                type: item.type,
                cartId: item.cartId,
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

    <Popup visible={visible} destroyOnClose className={style.positionPopup}>
      <Positions
        ids={[]}
        single
        onClose={() => setVisible(false)}
        onSuccess={(value = []) => {
          const skuItem = ToolUtil.isObject(visible);
          const newInstockList = instockList.map(item => {
            if (item.cartId === skuItem.cartId) {
              const positions = value[0] || {};
              return {
                ...skuItem,
                skuResult: {
                  ...skuItem.skuResult,
                  positionsResult: [{ storehousePositionsId: positions.id, name: positions.name }],
                },
              };
            }
            return item;
          });

          setInstockList(newInstockList);
          setVisible(false);
        }} />
    </Popup>

    {(instockLoading || backLoading) && <MyLoading />}
  </>;
};

export default WaitInstock;
