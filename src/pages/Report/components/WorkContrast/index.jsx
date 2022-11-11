import React, { useEffect, useState } from 'react';
import { classNames, isArray } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import WorkContrastChart from '../WorkContrastChart';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { instockOrderCountViewByUser } from '../Ranking';
import { RightOutline } from 'antd-mobile-icons';

const outStockLogView = { url: '/statisticalView/outStockLogView', method: 'POST' };

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

  const {
    loading: outStockLogViewLoading,
    run: outStockLogViewRun,
  } = useRequest(outStockLogView, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
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
      case 'outStock':
        outStockLogViewRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [module, date[0], date[1]]);

  if (instockLogViewLoading || outStockLogViewLoading) {
    return <MyLoading skeleton />;
  }


  let countText = '';
  let numberText = '';
  let countType = '';
  let numberType = '';
  let label = '';

  switch (module) {
    case 'inStock':
      countText = '入库次数';
      countType = 'ORDER_BY_CREATE_USER';
      numberText = '入库数量';
      numberType = 'ORDER_BY_DETAIL';
      label = type === 'ORDER_BY_DETAIL' ? '件' : '次'
      break;
    case 'outStock':
      countText = '出库次数';
      countType = 'ORDER_LOG';
      numberText = '出库数量';
      numberType = 'ORDER_LOG_DETAIL';
      label = type === 'ORDER_LOG_DETAIL' ? '件' : '次'
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
      label={label}
      countType={countType}
      numberType={numberType}
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
