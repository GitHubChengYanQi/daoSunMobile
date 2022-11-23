import React from 'react';
import { brandList } from '../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MyCheckList from '../../../../../components/MyCheckList';


const Brands = (
  {
    zIndex,
    visible,
    value = [],
    multiple,
    onClose = () => {
    },
    onChange = () => {
    },
    data = {},
  },
) => {

  return <>
    <MyCheckList
      api={brandList}
      multiple={multiple}
      searchLabel='brandName'
      label='brandName'
      listKey='brandId'
      onClose={onClose}
      onChange={onChange}
      value={value}
      visible={visible}
      data={data}
      title='选择品牌'
      zIndex={zIndex}
    />
  </>;
};

export default Brands;
