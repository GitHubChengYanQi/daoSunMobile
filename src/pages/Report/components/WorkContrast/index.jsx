import React, { useState } from 'react';
import { classNames } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import WorkContrastChart from '../WorkContrastChart';

const WorkContrast = (
  {
    module,
  },
) => {

  const [type, setType] = useState('total');

  const data = [
    { genre: '张三', sold: 275 },
    { genre: '李四', sold: 115 },
    { genre: '王二麻子', sold: 120 },
    { genre: '小淘气', sold: 350 },
  ];


  let countText = '';
  let numberText = '';

  switch (module) {
    case 'inStock':
      countText = '入库次数';
      numberText = '入库数量';
      break;
    case 'outStock':
      countText = '出库次数';
      numberText = '出库数量';
      break;
    default:
      break;
  }


  return <div className={classNames(styles.card, styles.workContrast)}>
    <div className={styles.workContrastHeader}>
      <div className={styles.workContrastHeaderLabel}>工作量对比</div>
      <div className={styles.workContrastType}>
        <div
          onClick={() => setType('total')}
          className={type === 'total' ? styles.workContrastTypeChecked : ''}
        >
          {countText}
        </div>
        <div
          onClick={() => setType('number')}
          className={type === 'number' ? styles.workContrastTypeChecked : ''}
        >
          {numberText}
        </div>
      </div>
    </div>
    <WorkContrastChart data={data} />
  </div>;
};

export default WorkContrast;
