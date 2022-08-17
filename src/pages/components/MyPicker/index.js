import React from 'react';
import { ToolUtil } from '../ToolUtil';
import { Picker } from 'antd-mobile';


const MyPicker = (
  {
    options,
    visible,
    onClose = () => {
    },
    value,
    onChange = () => {
    },
  }) => {

  return <>
    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[options]}
      visible={visible}
      onClose={onClose}
      value={[value]}
      onConfirm={(value, options) => {
        onChange(ToolUtil.isArray(options.items)[0] || {});
      }}
    />
  </>;
};

export default MyPicker;
