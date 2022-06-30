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

const InstockError = (
  {
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

  const {
    loading,
    data: errorList,
    run: errorShop,
    refresh: shopRefresh,
  } = useRequest(shopCartAllList, { manual: true });

  const { loading: orderAddLoading, run: orderAdd } = useRequest(anomalyOrderAdd, {
    manual: true,
    onSuccess: () => {
      shopRefresh();
      Message.toast('添加异常单成功！');
    },
    onError: () => {
      Message.toast('添加异常单失败！');
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

  const errors = ToolUtil.isArray(errorList);

  const [data, setData] = useState([]);

  const allChecked = data.length === 0 ? false : errors.length === data.length;

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
          totalTitle: '申请总数',
          skuItem: <SkuItem
            skuResult={skuResult}
            extraWidth='80px'
            otherData={`${customerName || ''}${customerName && brandName ? ' / ' : ''}${brandName || ''}`}
          />,
        };
      case ReceiptsEnums.stocktaking:
        return {
          totalTitle: '实际总数',
          skuItem: <SkuItem
            skuResult={skuResult}
            extraWidth='80px'
            otherData={brandName}
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
            type: 'StocktakingError',
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
        异常 {errors.length}
      </div>
      <div className={style.skuList}>
        {loading ? <MyLoading skeleton /> : <>
          {errors.length === 0 && <MyEmpty description='暂无异常物料' />}
          {
            errors.map((item, index) => {

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
                  <FormOutlined style={{ fontSize: 18 }} onClick={() => {
                    onEdit(anomalyResult.anomalyId, errors.length);
                  }} />
                </div>
                <div className={style.errorAction}>
                  <div className={style.number}>
                    <span hidden={!anomalyResult.errorNumber}>数量：<span
                      className={style.red}>{anomalyResult.errorNumber > 0 ? `+${anomalyResult.errorNumber}` : anomalyResult.errorNumber}</span></span>
                    <span hidden={!anomalyResult.otherNumber}>质量：<span
                      className={style.yellow}>{anomalyResult.otherNumber}</span></span>
                    <span>{errorType().totalTitle}：<span
                      className={style.black}>{anomalyResult.needNumber}</span></span>
                  </div>
                  <Button color='primary' fill='outline' onClick={() => {
                    orderAdd({
                      data: {
                        instockOrderId: formId,
                        type: 'instock',
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
              setData(errors);
            }
          }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 种</span>
        </div>
        <div className={style.buttons}>
          <Button color='danger' disabled={data.length === 0} fill='outline' onClick={() => {
            backRun({
              data: { ids: data.map(item => item.cartId) },
            });
          }}>退回</Button>
          <Button
            disabled={data.length === 0}
            color='primary'
            fill='outline'
            onClick={() => {
              orderAdd({
                data: {
                  instockOrderId: formId,
                  type: 'instock',
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
