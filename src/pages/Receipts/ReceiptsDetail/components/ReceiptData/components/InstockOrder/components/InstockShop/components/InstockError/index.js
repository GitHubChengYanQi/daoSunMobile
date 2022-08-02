import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { anomalyOrderAdd, shopCartAllList } from '../../../../../../../../../../Work/Instock/Url';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import style from '../../index.less';
import { CloseOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Button } from 'antd-mobile';
import { FormOutlined } from '@ant-design/icons';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import { Message } from '../../../../../../../../../../components/Message';
import { sendBack } from '../WaitInstock';
import { ReceiptsEnums } from '../../../../../../../../../index';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const InstockError = (
  {
    showStock,
    noBack,
    anomalyType,
    formId,
    onClose = () => {
    },
    onEdit = () => {
    },
    refresh = () => {
    },
    type,
  },
) => {

  const [errorList, setErrorList] = useState([]);

  const {
    loading, run: errorShop, refresh: shopRefresh,
  } = useRequest(shopCartAllList, {
    manual: true,
    onSuccess: (res) => {
      const list = ToolUtil.isArray(res);
      switch (type) {
        case ReceiptsEnums.instockOrder:
          setErrorList(list);
          break;
        case ReceiptsEnums.stocktaking:
          if (showStock) {
            setErrorList(list);
          } else {
            const newList = list.filter(item => {
              const anomalyResult = item.anomalyResult || {};
              return anomalyResult.otherNumber !== 0
            });
            setErrorList(newList);
          }
          break;
        default:
          break;
      }
    },
  });

  const { loading: orderAddLoading, run: orderAdd } = useRequest(anomalyOrderAdd, {
    manual: true,
    onSuccess: (res) => {
      Message.successToast('提报成功！', () => {
        refresh(res, 99);
        shopRefresh();
        setData([]);
      });
    },
  });

  // 移出
  const { loading: backLoading, run: backRun } = useRequest(sendBack, {
    manual: true,
    onSuccess: (res) => {
      const skus = ToolUtil.isArray(res).map(item => {
        const positions = ToolUtil.isArray(item.storehousePositions)[0] || {};
        return {
          ...item,
          positionId: positions.storehousePositionsId,
        };
      });
      Message.successToast('移出成功！', () => {
        shopRefresh();
        refresh(skus, 0);
        setData([]);
      });
    },
  });

  const [data, setData] = useState([]);

  const allChecked = data.length === 0 ? false : errorList.length === data.length;

  const check = (checked, item) => {
    if (!checked) {
      setData([...data, item]);
    } else {
      setData(data.filter(currentItem => currentItem.cartId !== item.cartId));
    }
  };

  const errorType = (item = {}) => {
    const skuResult = item.skuResult || {};
    const customerName = ToolUtil.isObject(item.customer).customerName;
    const brandName = ToolUtil.isObject(item.brandResult).brandName;
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          totalTitle: '申请数量',
          type: 'instock',
          skuItem: <SkuItem
            skuResult={skuResult}
            extraWidth='80px'
            otherData={[
              customerName,
              brandName || '无品牌',
            ]}
          />,
        };
      case ReceiptsEnums.stocktaking:
        return {
          totalTitle: '账面库存',
          type: 'Stocktaking',
          skuItem: <SkuItem
            hiddenNumber={!showStock}
            skuResult={skuResult}
            extraWidth='80px'
            otherData={[brandName]}
          />,
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        errorShop({
          data: {
            receiptsEnum: ReceiptsEnums.instockOrder,
            type: 'InstockError',
            sourceId: formId,
            status: 0,
          },
        });
        break;
      case ReceiptsEnums.stocktaking:
        errorShop({
          data: {
            receiptsEnum: ReceiptsEnums.stocktaking,
            type: anomalyType,
            sourceId: formId,
            status: 0,
          },
        });
        break;
      default:
        return;
    }

  }, []);

  return <>
    <div className={style.content}>
      <div className={style.header}>
        异常物料
        <span onClick={() => {
          onClose();
        }}><CloseOutline /></span>
      </div>
      <div className={style.screen}>
        数量：{errorList.length} 类
      </div>
      <div className={style.skuList}>
        {loading ? <MyLoading skeleton /> : <>
          {errorList.length === 0 && <MyEmpty description='暂无异常物料' />}
          {
            errorList.map((item, index) => {

              const checked = data.map(item => item.cartId).includes(item.cartId);

              const anomalyResult = ToolUtil.isObject(item.anomalyResult);

              return <div key={index}>
                <div style={{ border: 'none' }} className={style.skuItem}>
                  <MyCheck checked={checked} className={style.check} onChange={() => {
                    check(checked, item);
                  }} />
                  <div className={style.sku} onClick={() => {
                    check(checked, item);
                  }}>
                    {errorType(item).skuItem}
                  </div>
                  <div className={style.edit}>
                    <FormOutlined style={{ fontSize: 18 }} onClick={() => {
                      onEdit(anomalyResult.anomalyId, errorList.length);
                    }} />
                    <ShopNumber show value={anomalyResult.realNumber} />
                  </div>

                </div>
                <div className={style.errorAction}>
                  <div className={style.number}>
                    <span>{errorType().totalTitle}：<span
                      className={style.black}>{anomalyResult.needNumber}</span></span>
                    <span hidden={!anomalyResult.errorNumber}>数量差异：<span
                      className={style.red}>{anomalyResult.errorNumber > 0 ? `+${anomalyResult.errorNumber}` : anomalyResult.errorNumber}</span></span>
                    <span hidden={!anomalyResult.otherNumber}>其他异常：<span
                      className={style.yellow}>{anomalyResult.otherNumber}</span></span>
                  </div>
                  <Button color='primary' fill='outline' onClick={() => {
                    orderAdd({
                      data: {
                        instockOrderId: formId,
                        type: errorType().type,
                        anomalyParams: [{ anomalyId: anomalyResult.anomalyId }],
                      },
                    });
                  }}>
                    提交
                  </Button>
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
              setData(errorList);
            }
          }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 类</span>
        </div>
        <div className={style.buttons}>
          {!noBack && <Button color='danger' disabled={data.length === 0} fill='outline' onClick={() => {
            backRun({
              data: { ids: data.map(item => item.cartId) },
            });
          }}>移出</Button>}
          <Button
            disabled={data.length === 0}
            color='primary'
            onClick={() => {
              orderAdd({
                data: {
                  instockOrderId: formId,
                  type: errorType().type,
                  anomalyParams: data.map((item) => {
                    const anomalyResult = item.anomalyResult || {};
                    return { anomalyId: anomalyResult.anomalyId };
                  }),
                },
              });
            }}
          >提交</Button>
        </div>
      </div>
    </div>

    {(orderAddLoading || backLoading) && <MyLoading />}
  </>;
};

export default InstockError;
