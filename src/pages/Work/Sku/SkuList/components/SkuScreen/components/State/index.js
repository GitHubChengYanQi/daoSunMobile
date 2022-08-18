import React from 'react';
import { Card, Divider, Selector } from 'antd-mobile';
import style from '../../index.less';

const State = (
  {
    options = [],
    title,
    multiple,
    value = [],
    onChange = () => {
    },
    columns,
  }) => {

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <Selector
        columns={columns ||3}
        className={style.skuClass}
        style={{
          '--border': 'solid transparent 1px',
          '--checked-border': 'solid var(--adm-color-primary) 1px',
          '--padding': '4px 15px',
        }}
        showCheckMark={false}
        options={options}
        multiple={multiple}
        value={value}
        onChange={(v) => {
          onChange(v || []);
        }}
      />
    </Card>

  </div>;
};

export default State;
