import React, { useState } from 'react';
import { AddButton } from '../../../../../components/MyButton';
import styles from './index.less';
import LinkButton from '../../../../../components/LinkButton';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import { Input } from 'antd-mobile';
import MyCard from '../../../../../components/MyCard';
import MyDatePicker from '../../../../../components/MyDatePicker';
import MyPicker from '../../../../../components/MyPicker';
import { Message } from '../../../../../components/Message';
import MyRemoveButton from '../../../../../components/MyRemoveButton';
import { MathCalc } from '../../../../../../util/ToolUtil';

const PaymentDetail = (
  {
    money,
    value = [],
    onChange = () => {
    },
    payPlan,
  }) => {

  const dataChange = (param, key) => {
    if (!money) {
      Message.toast('请输入采购总价!');
      return;
    }
    let percentum = 0;
    const newData = value.map((item, index) => {
      if (index === key) {
        const newItem = { ...item, ...param };
        percentum = MathCalc(newItem.percentum, percentum, 'jia');
        return newItem;
      }
      percentum = MathCalc(item.percentum, percentum, 'jia');
      return item;
    });
    onChange(newData);
  };

  const [open, setOpen] = useState();

  return <>
    {
      value.map((item, index) => {
        return <MyCard
          key={index}
          className={styles.PaymentDetailItem}
          headerClassName={styles.headerClassName}
          bodyClassName={styles.bodyClassName}
          titleBom={`第${index + 1}批`}
          extra={<MyRemoveButton onRemove={() => {
            onChange(value.filter((item, valueIndex) => valueIndex !== index));
          }} />}
        >
          {payPlan === 2 ? <div className={styles.detailItem}>
            <div
              className={styles.flexCenter}
            >
              日期： <MyDatePicker
              precision='second'
              show={item.payTime || <LinkButton title='请选择' />}
              value={item.payTime}
              onChange={(payTime) => dataChange({ payTime }, index)}
            />
            </div>
          </div> : <div className={styles.detailItem}>
            <div
              className={styles.flexCenter}
              onClick={() => setOpen({ type: 'payType', value: item.payType, key: index })}
            >
              动作：{item.payTypeName || <LinkButton title='请选择' />}
            </div>
            <div className={styles.flexCenter}>
              时间：<ShopNumber
              number
              value={item.dateNumber || 0}
              onChange={(dateNumber) => dataChange({ dateNumber }, index)}
            />
            </div>
            <div
              className={styles.flexCenter}
              onClick={() => setOpen({ type: 'dateWay', value: item.dateWay, key: index })}
            >
              类型：{item.dateWayName || <LinkButton title='请选择' />}
            </div>
          </div>}
          <div className={styles.detailItem}>
            <div className={styles.flexCenter}>
              付款比例：
              <ShopNumber
                number
                max={100}
                value={item.percentum || 0}
                onChange={(percentum) => {
                  let percentums = 0;
                  value.forEach((item, valueIndex) => {
                    if (valueIndex !== index) {
                      percentums = MathCalc(item.percentum, percentums, 'jia');
                    }
                  });
                  const remaining = MathCalc(100, percentums, 'jian');
                  const newPercentum = remaining > percentum ? percentum : remaining;
                  dataChange({
                    percentum: newPercentum,
                    money: Number(MathCalc(money, MathCalc(newPercentum, 100, 'chu'), 'cheng').toFixed(2)),
                  }, index);
                }}
              />
              &nbsp;&nbsp; %
            </div>
            <div style={{ marginLeft: 16 }} className={styles.flexCenter}>
              付款金额：
              <ShopNumber
                decimal={2}
                number
                value={item.money || 0}
                onChange={($) => {
                  let moneys = 0;
                  value.forEach((item, valueIndex) => {
                    if (valueIndex !== index) {
                      moneys = MathCalc(item.money, moneys, 'jia');
                    }
                  });
                  const remaining = MathCalc(money, moneys, 'jian');
                  const newMoney = remaining > $ ? $ : remaining;
                  dataChange({
                    money: newMoney,
                    percentum: Number(MathCalc(((MathCalc(($),money,'chu')).toFixed(2)), 100, 'cheng')),
                  }, index);
                }}
              />
            </div>
          </div>
          <div className={styles.detailItem}>
            <span style={{ width: 90 }}>款项说明：</span>
            <Input
              placeholder='请输入款项说明'
              value={item.remark}
              onChange={(remark) => dataChange({ remark }, index)}
            />
          </div>
          <div className={styles.space} />
        </MyCard>;
      })
    }
    <div style={{ textAlign: 'center' }}>
      <AddButton className={styles.add} onClick={() => {
        if (!money) {
          Message.toast('请输入采购总价!');
          return;
        }
        onChange([...value, { payType: null, dateNumber: 1, dateWay: 0, dateWayName: '天' }]);
      }}>添加付款批次</AddButton>
    </div>


    <MyPicker
      onClose={() => setOpen()}
      options={[
        { label: '订单创建后', value: 0 },
        { label: '合同签订后', value: 1 },
        { label: '订单发货前', value: 2 },
        { label: '订单发货后', value: 3 },
        { label: '入库后', value: 4 },
      ]}
      visible={open?.type === 'payType'}
      value={open?.value}
      onChange={(option) => {
        dataChange({ payType: option.value, payTypeName: option.label }, open?.key);
      }}
    />

    <MyPicker
      onClose={() => setOpen()}
      options={[
        { label: '天', value: 0 },
        { label: '月', value: 1 },
        { label: '年', value: 2 },
      ]}
      visible={open?.type === 'dateWay'}
      value={open?.value}
      onChange={(option) => {
        dataChange({ dateWay: option.value, dateWayName: option.label }, open?.key);
      }}
    />
  </>;
};

export default PaymentDetail;
