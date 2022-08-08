import React from 'react';
import { Radio } from 'antd-mobile';
import Icon from '../Icon';

const MyRadio = (
  {
    checked,
    onChange = () => {
    },
    children,
  },
) => {


  return <>
    <Radio
      icon={(checked) => {
        return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
      }}
      checked={checked}
      key='children'
      style={{
        '--icon-size': '14px',
        '--font-size': '14px',
        '--gap': '6px',
      }}
      onChange={onChange}
    >
      {children}
    </Radio>
  </>;
};

export default MyRadio;
