import React from 'react';
import style from '../../index.less';
import { Card, Divider } from 'antd-mobile';
import StartEndDate from '../../../../../../../components/StartEndDate';

const Time = (
  {
    value = [],
    title,
    max,
    getContainer,
    onChange = () => {
    },
  }) => {


  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <StartEndDate
        getContainer={getContainer}
        minWidth='100%'
        textAlign='left'
        value={value}
        max={max}
        onChange={onChange}
      />
    </Card>
  </div>;
};

export default Time;
