import React, { useImperativeHandle, useRef, useState } from 'react';
import { orderList } from '../../../../../../Order/Url';
import MyList from '../../../../../../../components/MyList';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { DownOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../Sku/SkuItem';
import { Button, Divider } from 'antd-mobile';
import accounting from 'accounting-big';
import { useHistory } from 'react-router-dom';

const PurchaseOrder = (
  {
    type,
    getCount = () => {
    },
  }, ref) => {

  const [data, setData] = useState([]);

  const history = useHistory();

  const submitRef = useRef();

  const dataChange = (dataItem, itemIndex) => {
    const newData = data.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, ...dataItem };
      }
      return item;
    });
    setData(newData);
  };

  useImperativeHandle(ref, () => ({
    submit: submitRef.current.submit,
  }));

  return <>
    <MyList
      ref={submitRef}
      api={orderList}
      params={{ type: 1 }}
      getData={setData}
      data={data}
      response={(res) => {
        getCount(res.count);
      }}
    >
      {
        data.map((item, index) => {
          const skus = item.detailResults || [];
          let money = 0;
          skus.map(item => money += item.totalPrice);
          return <div key={index} className={style.orderItem}>
            <div className={style.data}>
              <div className={style.customer}>
                {ToolUtil.isObject(item.bcustomer).customerName} <RightOutline style={{ color: '#B9B9B9' }} />
              </div>
              <div className={style.status}>
                执行中
              </div>
            </div>
            {
              skus.map((skuItem, skuIndex) => {
                const unit = ToolUtil.isObject(skuItem.unit);
                if (!item.allSku && skuIndex > 0) {
                  return null;
                }
                return <div key={skuIndex} className={style.skus}>
                  <div className={style.skuItem}>
                    <SkuItem
                      imgSize={60}
                      skuResult={skuItem.skuResult}
                      extraWidth='94px'
                      otherData={[ToolUtil.isObject(skuItem.brandResult).brandName]}
                    />
                  </div>
                  <div className={style.skuData}>
                    <div className={style.skuDataNumber}>
                      <span>×{skuItem.purchaseNumber}</span>{unit.unitName}
                    </div>
                    <div className={style.skuDataMoney}>
                      {accounting.formatMoney(skuItem.totalPrice || 0, '￥')}
                    </div>
                  </div>
                </div>;
              })
            }
            {skus.length > 1 && <Divider className={style.allSku}>
              <div onClick={() => {
                dataChange({ allSku: !item.allSku }, index);
              }}>
                {
                  item.allSku ?
                    <UpOutline />
                    :
                    <DownOutline />
                }
              </div>
            </Divider>}
            <div className={style.data}>
              <div className={style.createTime}>{item.createTime} </div>
              <div className={style.money}>合计 <span>{accounting.formatMoney(money, '￥')}</span></div>
            </div>
            <div className={style.data}>
              <div className={style.coding}>{item.coding} </div>
              <Button
                color='primary'
                fill='outline'
                className={style.button}
                onClick={() => {
                  history.push(`/Work/Instock/InstockAsk/Submit?type=${type}&id=${item.orderId}`);
                }}
              >选择
              </Button>
            </div>
          </div>;
        })
      }
    </MyList>
  </>;
};

export default React.forwardRef(PurchaseOrder);
