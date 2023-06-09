import React from 'react';
import { spuClassListSelect } from '../../../../Instock/Url';
import MyCheckList from '../../../../../components/MyCheckList';

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

  return <>
    <MyCheckList
      anyLabel={!multiple && '全部'}
      noSearch
      noPage
      searchPlaceholder='请输入分类信息'
      api={spuClassListSelect}
      multiple={multiple}
      label='label'
      listKey='value'
      onClose={onClose}
      onChange={(values) => {
        if (values.value === 'any') {
          onChange({});
        } else {
          onChange(values);
        }
      }}
      value={value}
      visible={visible}
      title='选择分类'
      zIndex={zIndex}
    />
  </>;
};

export default SkuClass;
