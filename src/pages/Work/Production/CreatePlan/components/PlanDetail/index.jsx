import React, { useState } from 'react';
import Title from '../../../../../components/Title';
import styles from './index.less';
import MyCard from '../../../../../components/MyCard';
import { AddButton } from '../../../../../components/MyButton';
import { Divider, Input } from 'antd-mobile';
import SelectBom from '../../SelectBom';
import MyAntPopup from '../../../../../components/MyAntPopup';
import SkuItem from '../../../../Sku/SkuItem';
import MyRemoveButton from '../../../../../components/MyRemoveButton';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import LinkButton from '../../../../../components/LinkButton';
import BottomButton from '../../../../../components/BottomButton';
import { FillinOutline, MinusCircleOutline } from 'antd-mobile-icons';
import MyEllipsis from '../../../../../components/MyEllipsis';
import { Message } from '../../../../../components/Message';
import { isArray } from '../../../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import MySearch from '../../../../../components/MySearch';

const PlanDetail = (
  {
    required,
    filedName,
    onChange = () => {
    },
    value = [],
    type,
  },
) => {

  const history = useHistory();

  const order = type === 'order';

  const [addBoms, setAddBoms] = useState(false);
  const [addOrder, setAddOrder] = useState(false);

  const [contract, setContract] = useState({});

  const updateValue = (key, data) => {
    const newValue = value.map((item, index) => {
      if (index === key) {
        return { ...item, ...data };
      }
      return item;
    });
    onChange(newValue);
  };


  const skuItems = (item, index, key) => {
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

        <div>
          <ShopNumber
            value={item.number}
            getContainer={document.body}
            id={`stepper${index}`}
            onChange={(number) => {
              updateValue(index, { number });
            }}
          />
        </div>
      </div>
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
            return <div key={index} className={styles.contractList}>
              <div className={styles.contractItem}>
                <MyRemoveButton
                  icon={<MinusCircleOutline />}
                  onRemove={() => {
                    onChange(value.filter((item, valueIndex) => valueIndex !== index));
                  }}
                />
                <div className={styles.info}>
                  <MyEllipsis maxWidth='70vw'>客户 / 合同：{item.customerName} / {item.contractCoding}</MyEllipsis>
                </div>
                <LinkButton onClick={() => {
                  setContract({ ...item, key: index });
                }}><FillinOutline /></LinkButton>
              </div>
              {
                isArray(item.details).map((item, detailIndex) => {
                  return skuItems(item, detailIndex, index);
                })
              }
              <div className={styles.space} />
            </div>;
          } else {
            return skuItems(item, index);
          }
        })
      }

      <Divider>
        <AddButton onClick={() => {
          setAddOrder(true);
        }} />
      </Divider>
    </MyCard>

    <MyAntPopup
      title='物料清单选择'
      position='right'
      visible={addBoms}
      onClose={() => history.goBack()}
    >
      <SelectBom
        value={value.map((item, index) => ({ ...item, id: index }))}
        contractType={order}
        onClose={() => setAddBoms(false)}
        onSubmit={(skus) => {
          if (order) {
            const newValue = value.map((item, index) => {
              let number = 0;
              const details = skus.find(item => {
                const detail = item.details.find(item => item.id === index);
                if (detail) {
                  number = detail.number;
                }
                return detail;
              });
              return {
                ...item,
                details: details ? [...isArray(item.details), { ...details, number }] : item.details,
              };
            });
            onChange(newValue);
          } else {
            onChange(skus);
          }
          history.goBack();
        }}
      />
    </MyAntPopup>

    <MyAntPopup
      title='添加订单'
      visible={addOrder}
      onClose={() => setAddOrder(false)}
    >
      <div className={styles.addContract}>
       <MySearch />
      </div>
      <BottomButton
        leftText='取消'
        rightText='确认'
        leftOnClick={() => {

        }}
        rightOnClick={() => {

        }}
      />
    </MyAntPopup>
  </>;
};

export default PlanDetail;
