import React from 'react';
import { Card, Divider, Selector } from 'antd-mobile';
import style from '../../index.less';
import { SelectorStyle } from '../../../../../../../Report/InOutStock';

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
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
    >
      <Selector
        columns={3}
        // multiple
        className={style.skuClass}
        style={SelectorStyle}
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
