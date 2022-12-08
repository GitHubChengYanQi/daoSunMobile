import React from 'react';
import { supplyList } from '../../../../Sku/SkuList/components/SkuScreen/components/Url';
import MyCheckList from '../../../../../components/MyCheckList';

const Customers = (
  {
    zIndex,
    visible,
    value = [],
    multiple,
    onClose = () => {
    },
    onChange = () => {
    },
    data = { supply: 1 },
  },
) => {


  return <>
    <MyCheckList
      searchPlaceholder='请输入供应商信息'
      api={supplyList}
      multiple={multiple}
      searchLabel='customerName'
      label='customerName'
      listKey='customerId'
      onClose={onClose}
      onChange={onChange}
      value={value}
      visible={visible}
      data={data}
      title='选择供应商'
      zIndex={zIndex}
    />
  </>;
};

export default Customers;
