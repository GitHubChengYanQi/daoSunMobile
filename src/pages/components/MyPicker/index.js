import React from 'react';
import { ToolUtil } from '../ToolUtil';
import { Picker } from 'antd-mobile';
import { useRequest } from '../../../util/Request';


const MyPicker = (
  {
    api,
    options,
    visible,
    onClose = () => {
    },
    value,
    onChange = () => {
    },
  }) => {

  const { data = [] } = useRequest(api, { manual: !api });

  return <>
    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[api ? data : options]}
      visible={visible}
      onClose={onClose}
      value={value ? [value] : []}
      onConfirm={(value, options) => {
        onChange(ToolUtil.isArray(options.items)[0] || {});
      }}
    />
  </>;
};

export default MyPicker;
