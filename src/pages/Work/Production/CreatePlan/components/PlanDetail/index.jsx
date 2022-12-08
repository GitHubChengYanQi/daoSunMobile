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

  const contractType = true || type === 'ContractOrder';

  const [addBoms, setAddBoms] = useState(false);
  const [addContracts, setAddContracts] = useState(false);

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


  const skuItems = (item, index) => {
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
      extra={contractType && <LinkButton onClick={() => {
        setContract({});
        setAddContracts(true);
      }}>添加合同</LinkButton>}
    >
      {
        value.map((item, index) => {
          if (contractType) {
            return <div key={index} className={styles.contractList}>
              <div className={styles.contractItem}>
                <LinkButton color='danger'> <MinusCircleOutline /></LinkButton>
                <div className={styles.info}>
                  <MyEllipsis maxWidth='70vw'>客户 / 合同：{item.customerName} / {item.contractCoding}</MyEllipsis>
                </div>
                <LinkButton onClick={() => {
                  setContract({ ...item, key: index });
                  setAddContracts(true);
                }}><FillinOutline /></LinkButton>
              </div>
              {
                [1, 2].map((item, index) => {
                  return skuItems(item, index);
                })
              }
              <div className={styles.space} />
            </div>;
          } else {
            return skuItems(item, index);
          }
        })
      }

      {value.length > 0 && <Divider>
        <AddButton onClick={() => {
          setAddBoms(true);
        }} />
      </Divider>}
    </MyCard>

    <MyAntPopup
      title='物料清单选择'
      position='right'
      visible={addBoms}
      onClose={() => setAddBoms(false)}
    >
      <SelectBom
        value={value}
        contractType={contractType}
        onClose={() => setAddBoms(false)}
        onSubmit={(skus) => {
          onChange(skus);
          setAddBoms(false);
        }}
      />
    </MyAntPopup>

    <MyAntPopup
      title='添加合同'
      visible={addContracts}
      onClose={() => setAddContracts(false)}
    >
      <div className={styles.addContract}>
        <div className={styles.addContractItem}>
          <div>
            客户
          </div>
          <Input
            placeholder='请输入客户名称' value={contract.customerName || ''}
            onChange={(customerName) => setContract({ ...contract, customerName })}
          />
        </div>
        <div className={styles.addContractItem}>
          <div>
            合同
          </div>
          <Input
            placeholder='请输入合同编码'
            value={contract.contractCoding || ''}
            onChange={(contractCoding) => setContract({ ...contract, contractCoding })}
          />
        </div>
      </div>
      <BottomButton
        disabled={!(contract.contractCoding && contract.customerName)}
        only={typeof contract.key === 'number'}
        text='修改合同'
        onClick={() => {
          updateValue(contract.key, contract);
        }}
        leftText='继续添加合同'
        rightText='添加物料清单'
        leftDisabled={!(contract.contractCoding && contract.customerName)}
        rightDisabled={!(contract.contractCoding && contract.customerName)}
        leftOnClick={() => {
          Message.toast('添加成功！');
          setContract({});
          onChange([...value, contract]);
        }}
        rightOnClick={() => {
          setAddContracts(false);
          setAddBoms(true);
        }}
      />
    </MyAntPopup>
  </>;
};

export default PlanDetail;
