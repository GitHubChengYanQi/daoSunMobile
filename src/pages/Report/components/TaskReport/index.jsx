import React, { useEffect, useState } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames, isArray } from '../../../components/ToolUtil';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';

const outStockOrderView = { url: '/statisticalView/outStockOrderView', method: 'POST' };
const inStockOrderView = { url: '/statisticalView/instockOrderView', method: 'POST' };

const TaskReport = (
  {
    size,
    module,
    gap,
    date = [],
  },
) => {

  const [type, setType] = useState('ORDER_TYPE');

  const [typeTotal, setTypeTotal] = useState([]);

  const currentTotal = (type, noTypes) => {
    if (noTypes) {
      let number = 0;
      typeTotal.forEach(item => {
        if (!noTypes.includes(item.type)) {
          number += item.number;
        }
      });
      return number || 0;
    }
    const currentTotal = typeTotal.find(item => item.type === type) || {};
    return currentTotal.number || 0;
  };

  const { loading: outLoading, run: outRun } = useRequest(outStockOrderView, {
    manual: true,
    onSuccess: (res) => {
      const newTypeTotal = isArray(res).map(item => ({ type: item.type || item.status, number: item.orderCount }));
      setTypeTotal(newTypeTotal);
    },
  });

  const { loading: inLoading, run: inRun } = useRequest(inStockOrderView, {
    manual: true,
    onSuccess: (res) => {
      const newTypeTotal = isArray(res).map(item => ({ type: item.type || item.status, number: item.orderCount }));
      setTypeTotal(newTypeTotal);
    },
  });

  const getData = (searchType) => {
    switch (module) {
      case 'inStock':
        inRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'outStock':
        outRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [module, date[0], date[1]]);

  let typeDescribe = [];
  let typeDescribeTotal = 0;

  const complete = currentTotal(99);
  const ing = currentTotal(0) + currentTotal(null, [0, 49, 50, 99]);
  const revoke = currentTotal(49);
  const statusDescribeTotal = complete + ing + revoke;

  const statusDescribe = [
    {
      title: '已完成',
      color: '#257BDE',
      numberText: `${complete} (${Math.round((complete / statusDescribeTotal) * 100)}%)`,
      number: complete,
    },
    {
      title: '执行中',
      color: '#FA8F2B',
      numberText: `${ing} (${Math.round((ing / statusDescribeTotal) * 100)}%)`,
      number: ing,
    },
    {
      title: '已撤销',
      color: '#D8D8D8',
      numberText: `${revoke} (${Math.round((revoke / statusDescribeTotal) * 100)}%)`,
      number: revoke,
    },
  ];

  switch (module) {
    case 'inStock':
      const PURCHASE_INSTOCK = currentTotal('PURCHASE_INSTOCK');
      const PRODUCTION_INSTOCK = currentTotal('PRODUCTION_INSTOCK');
      const PRODUCTION_RETURN = currentTotal('PRODUCTION_RETURN');
      const CUSTOMER_RETURN = currentTotal('CUSTOMER_RETURN');
      typeDescribeTotal = PURCHASE_INSTOCK + PRODUCTION_INSTOCK + PRODUCTION_RETURN + CUSTOMER_RETURN;
      typeDescribe = [
        {
          title: '物料采购',
          color: '#257BDE',
          numberText: `${PURCHASE_INSTOCK} (${Math.round((PURCHASE_INSTOCK / typeDescribeTotal) * 100) || 0}%)`,
          number: PURCHASE_INSTOCK,
        },
        {
          title: '生产完工',
          color: '#2EAF5D',
          numberText: `${PRODUCTION_INSTOCK} (${Math.round((PRODUCTION_INSTOCK / typeDescribeTotal) * 100) || 0}%)`,
          number: PRODUCTION_INSTOCK,
        },
        {
          title: '生产退料',
          color: '#FA8F2B',
          numberText: `${PRODUCTION_RETURN} (${Math.round((PRODUCTION_RETURN / typeDescribeTotal) * 100) || 0}%)`,
          number: PRODUCTION_RETURN,
        },
        {
          title: '客户退货',
          color: '#FF3131',
          numberText: `${CUSTOMER_RETURN} (${Math.round((CUSTOMER_RETURN / typeDescribeTotal) * 100) || 0}%)`,
          number: CUSTOMER_RETURN,
        },
      ];
      break;
    case 'outStock':
      const PRODUCTION_TASK = currentTotal('PRODUCTION_TASK');
      const PRODUCTION_LOSS = currentTotal('PRODUCTION_LOSS');
      const THREE_GUARANTEES = currentTotal('THREE_GUARANTEES');
      const LOSS_REPORTING = currentTotal('LOSS_REPORTING');
      const RESERVE_PICK = currentTotal('RESERVE_PICK');
      typeDescribeTotal = PRODUCTION_TASK + PRODUCTION_LOSS + THREE_GUARANTEES + LOSS_REPORTING + RESERVE_PICK;
      typeDescribe = [
        {
          title: '生产任务',
          color: '#257BDE',
          numberText: `${PRODUCTION_TASK} (${Math.round((PRODUCTION_TASK / typeDescribeTotal) * 100) || 0}%)`,
          number: PRODUCTION_TASK,
        },
        {
          title: '三包服务',
          color: '#D8D8D8',
          numberText: `${THREE_GUARANTEES} (${Math.round((THREE_GUARANTEES / typeDescribeTotal) * 100) || 0}%)`,
          number: THREE_GUARANTEES,
        },
        {
          title: '备品备件',
          color: '#2EAF5D',
          numberText: `${RESERVE_PICK} (${Math.round((RESERVE_PICK / typeDescribeTotal) * 100) || 0}%)`,
          number: RESERVE_PICK,
        },
        {
          title: '生产损耗',
          color: '#FA8F2B',
          numberText: `${PRODUCTION_LOSS} (${Math.round((PRODUCTION_LOSS / typeDescribeTotal) * 100) || 0}%)`,
          number: PRODUCTION_LOSS,
        },
        {
          title: '报损出库',
          color: '#FF3131',
          numberText: `${LOSS_REPORTING} (${Math.round((LOSS_REPORTING / typeDescribeTotal) * 100) || 0}%)`,
          number: LOSS_REPORTING,
        },
      ];
      break;
    default:
      break;
  }

  const data = type === 'ORDER_TYPE' ? typeDescribe : statusDescribe;

  let total = 0;

  data.forEach(item => total += item.number);

  if (outLoading || inLoading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.taskReport)}>
    <div className={styles.taskReportHeader}>
      <div className={styles.taskReportLabel}>任务统计</div>
      <div className={styles.taskReportType}>
        <div
          onClick={() => {
            getData('ORDER_TYPE');
            setType('ORDER_TYPE');
          }}
          className={type === 'ORDER_TYPE' ? styles.taskReportTypeChecked : ''}
        >
          类型
        </div>
        <div
          onClick={() => {
            getData('ORDER_STATUS');
            setType('ORDER_STATUS');
          }}
          className={type === 'ORDER_STATUS' ? styles.taskReportTypeChecked : ''}
        >
          状态
        </div>
      </div>
    </div>

    <div className={styles.taskRepoetChart}>
      <div>
        <Canvas pixelRatio={window.devicePixelRatio} width={size} height={size}>
          <Chart
            data={data}
            coord={{
              type: 'polar',
              transposed: true,
              radius: 1.4,
              innerRadius: 0.7,
            }}
          >
            <Interval
              x='a'
              y='number'
              adjust='stack'
              color={{
                field: 'title',
                range: data.map(item => item.color),
              }}
            />
          </Chart>
        </Canvas>
      </div>
      <div className={styles.taskReportDescribe}>
        <div>
          <span className={styles.taskReportTotalLabel}>总计</span>
          <span className='numberBlue' style={{ fontSize: 16 }}>{total}</span>
        </div>
        <div className={styles.taskRepoetChartTypes} style={{ gap }}>
          {
            (type === 'ORDER_TYPE' ? typeDescribe : statusDescribe).map((item, index) => {
              return <div className={styles.taskRepoetChartType} key={index}>
                <span style={{ backgroundColor: item.color }} className={styles.dian} />
                {item.title}
                <span>{item.numberText}</span>
              </div>;
            })
          }
        </div>
      </div>
    </div>
  </div>;
};

export default TaskReport;
