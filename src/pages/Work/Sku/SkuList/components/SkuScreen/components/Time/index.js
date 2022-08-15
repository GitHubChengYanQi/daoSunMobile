import React from 'react';
import style from '../../index.less';
import { Card, Divider } from 'antd-mobile';
import StartEndDate from '../../../../../../Production/CreateTask/components/StartEndDate';

const Time = (
  {
    value = [],
    title,
    onChange = () => {
    },
  }) => {


  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <StartEndDate
        minWidth='100%'
        textAlign='left'
        value={value}
        onChange={onChange}
      />
    </Card>
  </div>;
};

export default Time;
