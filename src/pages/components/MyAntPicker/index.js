import React, { useState } from 'react';
import { Picker } from 'antd-mobile';
import LinkButton from '../LinkButton';

const MyAntPicker = (
  {
    options,
    onChange = () => {
    },
    value,
    title,
  }) => {

  const [visible, setVisible] = useState(false);

  const [show, setShow] = useState({});

  return <>
    <LinkButton
      style={{ color: '#000', width: '100%', textAlign: 'left' }}
      title={show.label || (title || '请选择')}
      onClick={() => {
        setVisible(true);
      }} />
    <Picker
      columns={[options || []]}
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
