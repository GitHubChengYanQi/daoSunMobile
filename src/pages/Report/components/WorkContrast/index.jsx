import React, { useEffect, useState } from 'react';
import { classNames, isArray } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import WorkContrastChart from '../WorkContrastChart';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { instockOrderCountViewByUser } from '../Ranking';
import { RightOutline } from 'antd-mobile-icons';

const WorkContrast = (
  {
    module,
    date = [],
  },
) => {

  const [type, setType] = useState('ORDER_BY_CREATE_USER');

  const [total, setTotal] = useState(0);

  const [list, setList] = useState([]);

  const {
    loading: instockLogViewLoading,
    run: instockOrderCountViewByUserRun,
  } = useRequest(instockOrderCountViewByUser, {
    manual: true,
    onSuccess: (res) => {
      let total = 0;
      setList(isArray(res).map(item => {
        total += item.orderCount || item.inNumCount || 0;
        return {
          userName: item.userResult?.name,
          number: item.orderCount || item.inNumCount || 0,
        };
      }));
      setTotal(total);
    },
  });

  const getData = (searchType) => {
    switch (module) {
      case 'inStock':
        instockOrderCountViewByUserRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [module, date[0], date[1]]);

  if (instockLogViewLoading) {
    return <MyLoading skeleton />;
  }


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
      <RightOutline />
    </div>
    <WorkContrastChart
      getData={getData}
      countText={countText}
      numberText={numberText}
      setType={setType}
      data={list}
      type={type}
      total={total}
    />
  </div>;
};

export default WorkContrast;
