import React, { useEffect } from 'react';
import { Card } from 'antd-mobile';
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
      title={title}
      headerStyle={{ border: 'none' }}
    >
      <CheckPosition value={value} onChange={onChange} data={options} refresh={refreshPositions} />
    </Card>

  </div>;
};

export default Position;
