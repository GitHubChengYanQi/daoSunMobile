import { createFromIconfontCN } from '@ant-design/icons';
import iconfont from '../../../assets/font/iconfont';
import React from 'react';

const Icon = createFromIconfontCN({
  scriptUrl: iconfont,
});

export default Icon;

export const ScanIcon = (props) => {
  return <Icon type='icon-dibudaohang-saoma' {...props} />;
};
