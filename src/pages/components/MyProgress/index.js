import style from './index.less';
import { Progress } from 'antd';
import React from 'react';

const MyProgress = (
  {
    hidden,
    percent,
    className,
    format,
    success,
    trailColor,
    strokeColor,
  },
) => {

  return <div className={className || style.progress} hidden={hidden}>
    <Progress
      trailColor={trailColor}
      success={success}
      strokeColor={strokeColor || 'var(--adm-color-primary)'}
      format={(number) => {
        if (typeof format === 'function') {
          return format(number);
        }

        return <div
          className={style.text}
          style={{
            width: `${(number === 0 || number >= 100) ? 100 : number - 1}%`,
            textAlign: (number === 0 || number >= 100)? 'center' : 'right',
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
