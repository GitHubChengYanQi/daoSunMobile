import React, { useState } from 'react';
import { Picker } from 'antd-mobile';
import LinkButton from '../LinkButton';
import { useRequest } from '../../../util/Request';

const MyAntPicker = (
  {
    options,
    onChange = () => {
    },
    api,
    value,
    title,
  }) => {

  const [visible, setVisible] = useState(false);

  const [show, setShow] = useState({});

  const { data } = useRequest(api, { manual: !api });

  return <>
    <LinkButton
      style={{ color: '#000', width: '100%', textAlign: 'left' }}
      title={show.label || (title || '请选择')}
      onClick={() => {
        setVisible(true);
      }} />
    <Picker
      columns={[data || options || []]}
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      value={[value]}
      onConfirm={(value, options) => {
        setShow(options.items[0]);
        onChange(value[0]);
      }}
    />
  </>;
};

export default MyAntPicker;
