import React from 'react';
import { Card, Selector } from 'antd-mobile';
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
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <Selector
        columns={3}
        className={style.skuClass}
        style={{
          '--border-radius': '100px',
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '2px 10px',
        }}
        showCheckMark={false}
        options={options}
        multiple
        value={value}
        onChange={(v) => {
          onChange(v);
        }}
      />
    </Card>

  </div>;
};

export default State;
