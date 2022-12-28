import React, { useState } from 'react';
import Title from '../../../../../components/Title';
import styles from './index.less';
import MyCard from '../../../../../components/MyCard';
import { AddButton } from '../../../../../components/MyButton';
import { Divider, Input } from 'antd-mobile';
import SelectBom from '../../SelectBom';
import MyAntPopup from '../../../../../components/MyAntPopup';
import MyRemoveButton from '../../../../../components/MyRemoveButton';
import LinkButton from '../../../../../components/LinkButton';
import { FillinOutline, MinusCircleOutline } from 'antd-mobile-icons';
import MyEllipsis from '../../../../../components/MyEllipsis';
import { isArray, MathCalc } from '../../../../../../util/ToolUtil';
import { useHistory } from 'react-router-dom';
import SelectOrder from '../SelectOrder';
import Label from '../../../../../components/Label';
import SkuItem from '../../../../Sku/SkuItem';
import ShopNumber from '../../../../AddShop/components/ShopNumber';

const PlanDetail = (
  {
    required,
    filedName,
    onChange = () => {
    },
    value = [{}],
    type,
  },
) => {

  const history = useHistory();

  const order = type !== 'order';

  const [addBoms, setAddBoms] = useState(false);
  const [addOrder, setAddOrder] = useState(false);

  const updateValue = (key, data) => {
    const newValue = value.map((item, index) => {
      if (index === key) {
        return { ...item, ...data };
      }
      return item;
    });
    onChange(newValue);
  };

  const orderItem = (item, index, key) => {

    let numner = 0;
    isArray(item.detailResults).forEach(item => numner += (item.purchaseNumber || 0));

    return <div key={index} className={styles.detailItem}>
      <div className={styles.item}>
        <div>
          <Label className={styles.label}>国家</Label>：无
        </div>
        <div>
          <Label className={styles.label}>订单编号</Label>：{item.coding}
        </div>
        <div>
          <Label className={styles.label}>产品数量</Label>：{numner}
        </div>
        <div>
          <Label className={styles.label}>交货期</Label>：{item.leadTime || 0}天
        </div>
      </div>
      <div className={styles.action}>
        <MyRemoveButton onRemove={() => {
          if (!order) {
            const newValue = value.map((item, valueIndex) => {
              if (valueIndex === key) {
                return { ...item, details: item.details.filter((item, detailIndex) => detailIndex !== index) };
              }
              return item;
            });
            onChange(newValue);
            return;
          }
          onChange(value.filter((item, valueIndex) => valueIndex !== index));
        }} />
      </div>
    </div>;
  };

  const countryItem = (item = {}, index) => {
    return <div key={index} className={styles.contractList}>
      <div className={styles.contractItem}>
        {index !== value.length - 1 && <MyRemoveButton
          icon={<MinusCircleOutline />}
          onRemove={() => {
            onChange(value.filter((item, valueIndex) => valueIndex !== index));
          }}
        />}
        <div className={styles.info}>
          国家
        </div>
        <Input
          value={item.country || ''}
          className={styles.input}
          placeholder='请输入'
          onChange={(country) => {
            const newValue = value.map((item, key) => {
              if (index === key) {
                return { ...item, country };
              }
              return item;
            });
            onChange(index === value.length - 1 ? [...newValue, {}] : newValue);
          }}
        />
      </div>
      {
        isArray(item.skus).map((item, index) => {
          return <div key={index} className={styles.detailSkuItem}>
            <div className={styles.sku}>
              <SkuItem
                noView
                skuResult={item.skuResult}
                imgSize={80}
                gap={8}
                extraWidth='130px'
              />
            </div>
            <div className={styles.skuActions}>
              <MyRemoveButton />
              <div>
                ×{item.number}
              </div>
              <LinkButton>修改</LinkButton>
            </div>
          </div>;
        })
      }
      {index !== value.length - 1 && <Divider>
        <AddButton onClick={() => {
          setAddBoms(index + '');
        }} />
      </Divider>}
      <div hidden={index === value.length - 1} className={styles.space} />
    </div>;
  };

  return <>
    <MyCard
      headerClassName={styles.header}
      titleBom={required && <Title className={styles.title}>{filedName}<span>*</span></Title>}
      title={filedName}
      bodyClassName={styles.contractContent}
    >
      {
        value.map((item, index) => {
          if (order) {
            return orderItem(item, index);
          } else {
            return countryItem(item, index);
          }
        })
      }

      {order && <Divider>
        <AddButton onClick={() => {
          setAddOrder(true);
        }} />
      </Divider>}
    </MyCard>

    <MyAntPopup
      position='right'
      visible={addBoms}
      onClose={() => history.goBack()}
    >
      <SelectBom
        onClose={() => setAddBoms(false)}
        onSubmit={(skus) => {
          const newValue = value.map((item, index) => {
            if (index + '' === addBoms) {
              return { ...item, skus: [...isArray(item.skus), ...skus] };
            }
            return item;
          });
          onChange(newValue);
          history.goBack();
        }}
      />
    </MyAntPopup>

    <MyAntPopup
      destroyOnClose={false}
      title='添加订单'
      visible={addOrder}
      onClose={() => setAddOrder(false)}
    >
      <SelectOrder
        visible={addOrder}
        value={value}
        onChange={(orders) => {
          onChange(orders);
          setAddOrder(false);
        }}
        onClose={() => setAddOrder(false)}
      />
    </MyAntPopup>
  </>;
};

export default PlanDetail;
