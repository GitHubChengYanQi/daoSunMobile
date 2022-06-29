import React from 'react';
import { Card, Selector } from 'antd-mobile';
import style from '../../index.less';

const SkuClass = (
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
    >
      <Selector
        columns={3}
        // multiple
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

export default SkuClass;
