import React, { useState } from 'react';
import { Selector } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { isObject, ToolUtil } from '../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../util/Request';
import { supplyList } from '../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MySearch from '../../../../../components/MySearch';
import { MyLoading } from '../../../../../components/MyLoading';
import style from '../../../../Sku/SkuList/components/SkuScreen/index.less';
import { SelectorStyle } from '../../../../../Report/InOutStock';
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
  },
) => {

  const { loading: skuClassLoading, data: skuClass } = useRequest(spuClassListSelect);

  const [checkSkuClass, setCheckSkuClass] = useState(value);

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
      <div style={{ padding: 24 }}>
        {skuClassLoading ? <MyLoading skeleton /> : <Selector
          columns={3}
          style={SelectorStyle}
          className={ToolUtil.classNames(style.supply, style.left)}
          showCheckMark={false}
          options={skuClass || []}
          value={checkSkuClass.map(item => item.value)}
          onChange={(v, { items }) => {
            setCheckSkuClass(items);
          }}
        />}
      </div>
    </MyAntPopup>
  </>;
};

export default SkuClass;
