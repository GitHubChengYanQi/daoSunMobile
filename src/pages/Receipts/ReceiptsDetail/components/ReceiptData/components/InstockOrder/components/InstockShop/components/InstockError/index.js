import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { anomalyOrderAdd, shopCartAllList } from '../../../../../../../../../../Work/Instock/Url';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import style from '../../index.less';
import { CloseOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../../Work/Sku/SkuItem';
import { Button } from 'antd-mobile';
import { FormOutlined } from '@ant-design/icons';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import { Message } from '../../../../../../../../../../components/Message';
import { sendBack } from '../WaitInstock';

const InstockError = (
  {
    instockOrderId,
    onClose = () => {
    },
    onEdit = () => {
    },
    refresh,
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

  useEffect(() => {
    errorShop({ data: { type: 'InstockError', sourceId: instockOrderId, status: 0 } });
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

              const skuResult = item.skuResult || {};
              const customerName = ToolUtil.isObject(item.customer).customerName || '-';
              const brandName = ToolUtil.isObject(item.brandResult).brandName || '-';

              return <div key={index}>
                <div style={{ border: 'none' }} className={style.skuItem}>
                  <LinkButton className={style.check} onClick={() => {
                    check(checked, item);
                  }}>
                    <MyCheck checked={checked} />
                  </LinkButton>
                  <div className={style.sku} onClick={() => {
                    check(checked, item);
                  }}>
                    <SkuItem
                      skuResult={skuResult}
                      extraWidth='80px'
                      otherData={`${customerName} / ${brandName}`}
                    />
                  </div>
                  <FormOutlined style={{ fontSize: 18 }} onClick={() => {
                    onEdit(anomalyResult.anomalyId, errors.length);
                  }} />
                </div>
                <div className={style.errorAction}>
                  <div className={style.number}>
                    <span hidden={!anomalyResult.errorNumber}>数量异常：<span
                      className={style.red}>{anomalyResult.errorNumber}</span></span>
                    <span hidden={!anomalyResult.otherNumber}>质量异常：<span
                      className={style.yellow}>{anomalyResult.otherNumber}</span></span>
                    <span>申请总数：<span className={style.black}>{anomalyResult.needNumber}</span></span>
                  </div>
                  <Button color='primary' fill='outline' onClick={() => {
                    orderAdd({
                      data: {
                        instockOrderId,
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
                  instockOrderId,
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
