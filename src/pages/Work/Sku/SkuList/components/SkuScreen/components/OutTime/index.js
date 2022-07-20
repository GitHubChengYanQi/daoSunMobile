import React from 'react';
import { Card, Divider, Radio } from 'antd-mobile';
import style from '../../index.less';
import Icon from '../../../../../../../components/Icon';

const OutTime = (
  {
    title,
    value,
    onChange = () => {
    },
  }) => {

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <Radio
        icon={(checked) => {
          return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
        }}
        checked={value === 'yes'}
        key='children'
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
          margin: '0 12px',
        }}
        onChange={() => {
          onChange('yes');
        }}
      >
        是
      </Radio>
      <Radio
        icon={(checked) => {
          return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
        }}
        checked={value === 'no'}
        key='no'
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
        }}
        onChange={() => {
          onChange('no');
        }}
      >
        否
      </Radio>
    </Card>

  </div>;
};

export default OutTime;
