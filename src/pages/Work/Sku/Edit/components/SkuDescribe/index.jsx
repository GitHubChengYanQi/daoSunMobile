import React, { useState } from 'react';
import LinkButton from '../../../../../components/LinkButton';
import MyAntPopup from '../../../../../components/MyAntPopup';
import { Divider, Input } from 'antd-mobile';
import MyRemoveButton from '../../../../../components/MyRemoveButton';
import styles from './index.less';
import { isArray } from '../../../../../../util/ToolUtil';
import { AddButton } from '../../../../../components/MyButton';

const SkuDescribe = (
  {
    zIndex,
    visible,
    value,
    onClose = () => {
    },
    onChange = () => {
    },
  },
) => {

  const [sku, setSku] = useState(isArray(value));

  return <>
    <MyAntPopup
      onClose={onClose}
      zIndex={zIndex}
      title='添加物料描述'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(sku.filter(item=>item.label && item.value));
      }}>确定</LinkButton>}
    >
      {
        sku.map((item, index) => {
          return <div className={styles.item} key={index}>
            <Input
              className={styles.input}
              value={item.label}
              placeholder='描述名称'
              onChange={(label) => {
                const newSku = sku.map((skuItem, skuIndex) => {
                  if (skuIndex === index) {
                    return { ...skuItem, label };
                  }
                  return skuItem;
                });
                setSku(newSku);
              }}
            />
            <Input
              className={styles.input}
              value={item.value}
              placeholder='描述内容'
              onChange={(value) => {
                const newSku = sku.map((skuItem, skuIndex) => {
                  if (skuIndex === index) {
                    return { ...skuItem, value };
                  }
                  return skuItem;
                });
                setSku(newSku);
              }}
            />
            <MyRemoveButton onRemove={() => {
              setSku(sku.filter((skuItem, skuIndex) => skuIndex !== index));
            }} />
          </div>;
        })
      }

      <Divider contentPosition='center'><AddButton onClick={() => {
        setSku([...sku, {}]);
      }} /></Divider>
    </MyAntPopup>
  </>;
};

export default SkuDescribe;
