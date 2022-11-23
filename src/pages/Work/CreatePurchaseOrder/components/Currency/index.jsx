import React, { useState } from 'react';
import { Loading } from 'antd-mobile';
import { useRequest } from '../../../../../util/Request';
import MyPicker from '../../../../components/MyPicker';
import LinkButton from '../../../../components/LinkButton';

const Currency = (
  {
    placeholder,
    value,
    onChange = () => {
    },
  }) => {

  const [visible, setVisible] = useState(false);

  const { loading, data } = useRequest({
    url: '/Enum/money',
    method: 'GET',
  });

  if (loading) {
    return <Loading />;
  }
  const options = data ? data.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  }) : [];

  return <>
    <div onClick={() => setVisible(true)}>{value || <LinkButton title={placeholder} />}</div>
    <MyPicker
      onClose={() => setVisible(false)}
      options={options}
      visible={visible}
      onChange={(options) => onChange(options.value)}
    />
  </>;
};

export default Currency;
