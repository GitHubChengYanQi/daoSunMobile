import React, { useEffect, useState } from 'react';
import { classNames, isArray } from '../../../../util/ToolUtil';
import styles from '../../InStockReport/index.less';
import WorkContrastChart from '../WorkContrastChart';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';

export const outStockLogView = { url: '/statisticalView/outStockLogView', method: 'POST' };
export const instockLogView = { url: '/statisticalView/instockLogView', method: 'POST' };

const WorkContrast = (
  {
    module,
    date = [],
  },
) => {

  const history = useHistory();

  const countType = 'ORDER_LOG';
  const numberType = 'ORDER_LOG_DETAIL';

  const [type, setType] = useState(countType);

  const [total, setTotal] = useState(0);

  const [list, setList] = useState([]);


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
  const {
    loading: instockLogViewLoading,
    run: instockLogViewRun,
  } = useRequest(instockLogView, {
    response: true,
    manual: true,
    onSuccess: (res) => {
      let total = 0;
      setList(isArray(res.data).map(item => {
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
      let total = 0;
      setList(isArray(res).map(item => {
        total += item.orderCount || item.outNumCount || 0;
        return {
          userName: item.userResult?.name,
          number: item.orderCount || item.outNumCount || 0,
        };
      }));
      setTotal(total);
    },
  });

  const getData = (searchType) => {
    switch (module) {
      case 'inStock':
        instockLogViewRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
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

  return <div className={classNames(styles.card, styles.workContrast)}>
    <div className={styles.workContrastHeader}>
      <div className={styles.workContrastHeaderLabel}>工作量对比</div>
      <RightOutline onClick={() => {
        history.push({
          pathname: '/Report/ReportDetail',
          search: `type=${module}`,
        });
      }} />
    </div>
    <WorkContrastChart
      label={type === 'ORDER_BY_DETAIL' ? '件' : '次'}
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
