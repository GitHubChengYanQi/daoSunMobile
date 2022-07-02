import React from 'react';
import { Card, Divider, Selector } from 'antd-mobile';
import style from '../../index.less';

const State = (
  {
    options = [],
    title,
    value = [],
    onChange = () => {
    },
  }) => {

  if (options.length <= 1 && value.length === 0) {
    return <></>;
  }

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <Selector
        columns={3}
        className={style.skuClass}
        style={{
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '4px 15px',
        }}
        showCheckMark={false}
        options={options}
        value={value}
        onChange={(v) => {
          onChange(v);
        }}
      />
    </Card>

  </div>;
};

export default State;
