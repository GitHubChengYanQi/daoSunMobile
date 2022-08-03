import style from './index.less';
import { Progress } from 'antd';
import React from 'react';

const MyProgress = (
  {
    hidden,
    percent,
  },
) => {


  return <div className={style.progress} hidden={hidden}>
    <Progress
      strokeColor='var(--adm-color-primary)'
      format={(number) => {
        return <div
          className={style.text}
          style={{
            width: `${[100, 0].includes(number) ? 100 : number - 1}%`,
            textAlign: [100, 0].includes(number) ? 'center' : 'right',
            color: number > 0 ? '#fff' : 'var(--adm-color-primary)',
          }}>
          {number + '%'}
        </div>;
      }}
      percent={percent}
    />
  </div>;
};

export default MyProgress;
