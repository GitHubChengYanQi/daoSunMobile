import React, { useEffect } from 'react';
import { Card, Divider } from 'antd-mobile';
import style from './index.less';
import { useBoolean } from 'ahooks';
import CheckPosition from './components/CheckPosition';

const Position = (
  {
    options = [],
    title,
    value,
    onChange = () => {
    },
    refresh,
  }) => {

  const [refreshPositions, { toggle }] = useBoolean();

  useEffect(() => {
    if (refresh && !value) {
      toggle();
    }
  }, [refresh]);

  useEffect(() => {
    toggle();
  }, [options.length]);


  if (options.length === 0 && !value) {
    return <></>;
  }

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <CheckPosition single value={value && [{ id: value }]} onChange={(value = []) => {
        const position = value[0] || {};
        onChange(position.id);
      }} data={options} refresh={refreshPositions} />
    </Card>

  </div>;
};

export default Position;
