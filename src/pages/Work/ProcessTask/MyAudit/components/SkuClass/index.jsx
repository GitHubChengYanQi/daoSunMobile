import React, { useEffect, useState } from 'react';
import { CheckList } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { isArray } from '../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import style from '../../../../Sku/SkuList/components/SkuScreen/index.less';
import { spuClassListSelect } from '../../../../Instock/Url';

const SkuClass = (
  {
    zIndex,
    visible,
    value = [],
    onClose = () => {
    },
    onChange = () => {
    },
    multiple,
  },
) => {

  const { loading: skuClassLoading, data: skuClass } = useRequest(spuClassListSelect);

  const [checkSkuClass, setCheckSkuClass] = useState([]);

  useEffect(() => {
    if (visible) {
      setCheckSkuClass(value);
    }
  }, [visible]);

  return <>
    <MyAntPopup
      onClose={onClose}
      zIndex={zIndex}
      title='选择供应商'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(checkSkuClass);
      }}>确定</LinkButton>}
    >
      <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
        {skuClassLoading ? <MyLoading skeleton /> : <CheckList
          style={{
            '--border-inner': 'solid 1px #f5f5f5',
            '--border-top': 'solid 1px #f5f5f5',
            '--border-bottom': 'solid 1px #f5f5f5',
          }}
          className={style.list}
          value={checkSkuClass.map(item => item.value)}
        >
          {
            isArray(skuClass).map((item, index) => {
              const checked = checkSkuClass.find(skuClass => skuClass.value === item.value);
              return <CheckList.Item
                key={index}
                value={item.value}
                onClick={() => {
                  if (multiple) {
                    setCheckSkuClass(checked ? checkSkuClass.filter(skuClass => skuClass.value !== item.value) : [...checkSkuClass, item]);
                  } else {
                    setCheckSkuClass(checked ? [] : [item]);
                  }
                }}
              >
                {item.label}
              </CheckList.Item>;
            })
          }
        </CheckList>}
      </div>
    </MyAntPopup>
  </>;
};

export default SkuClass;
