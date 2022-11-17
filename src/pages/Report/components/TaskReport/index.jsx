import React, { useEffect, useState } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames, isArray } from '../../../components/ToolUtil';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';

const outStockOrderView = { url: '/statisticalView/outStockOrderView', method: 'POST' };
const inStockOrderView = { url: '/statisticalView/instockOrderView', method: 'POST' };

const TaskReport = (
  {
    size,
    module,
    gap,
    date = [],
    title,
    searchTypes = [],
  },
) => {

  const [type, setType] = useState(searchTypes[0].type);

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
      case 'comprehensive':

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [module, date[0], date[1]]);

  let typeOne = [];
  let typeOneTotal = 0;

  let typeTwo = [];
  let typeTwoTotal = 0;

  switch (module) {
    case 'inStock':
      const PURCHASE_INSTOCK = currentTotal('PURCHASE_INSTOCK');
      const PRODUCTION_INSTOCK = currentTotal('PRODUCTION_INSTOCK');
      const PRODUCTION_RETURN = currentTotal('PRODUCTION_RETURN');
      const CUSTOMER_RETURN = currentTotal('CUSTOMER_RETURN');
      typeOneTotal = PURCHASE_INSTOCK + PRODUCTION_INSTOCK + PRODUCTION_RETURN + CUSTOMER_RETURN;
      typeOne = [
        {
          title: '物料采购',
          color: '#257BDE',
          numberText: `${PURCHASE_INSTOCK} (${Math.round((PURCHASE_INSTOCK / typeOneTotal) * 100) || 0}%)`,
          number: PURCHASE_INSTOCK,
        },
        {
          title: '生产完工',
          color: '#2EAF5D',
          numberText: `${PRODUCTION_INSTOCK} (${Math.round((PRODUCTION_INSTOCK / typeOneTotal) * 100) || 0}%)`,
          number: PRODUCTION_INSTOCK,
        },
        {
          title: '生产退料',
          color: '#FA8F2B',
          numberText: `${PRODUCTION_RETURN} (${Math.round((PRODUCTION_RETURN / typeOneTotal) * 100) || 0}%)`,
          number: PRODUCTION_RETURN,
        },
        {
          title: '客户退货',
          color: '#FF3131',
          numberText: `${CUSTOMER_RETURN} (${Math.round((CUSTOMER_RETURN / typeOneTotal) * 100) || 0}%)`,
          number: CUSTOMER_RETURN,
        },
      ];

      const inStockComplete = currentTotal(99);
      const inStockIng = currentTotal(0) + currentTotal(null, [0, 49, 50, 99]);
      const inStockRevoke = currentTotal(49);
      typeTwoTotal = inStockComplete + inStockIng + inStockRevoke;

      typeTwo = [
        {
          title: '已完成',
          color: '#257BDE',
          numberText: `${inStockComplete} (${Math.round((inStockComplete / typeTwoTotal) * 100) || 0}%)`,
          number: inStockComplete,
        },
        {
          title: '执行中',
          color: '#FA8F2B',
          numberText: `${inStockIng} (${Math.round((inStockIng / typeTwoTotal) * 100) || 0}%)`,
          number: inStockIng,
        },
        {
          title: '已撤销',
          color: '#D8D8D8',
          numberText: `${inStockRevoke} (${Math.round((inStockRevoke / typeTwoTotal) * 100) || 0}%)`,
          number: inStockRevoke,
        },
      ];
      break;
    case 'outStock':
      const PRODUCTION_TASK = currentTotal('PRODUCTION_TASK');
      const PRODUCTION_LOSS = currentTotal('PRODUCTION_LOSS');
      const THREE_GUARANTEES = currentTotal('THREE_GUARANTEES');
      const LOSS_REPORTING = currentTotal('LOSS_REPORTING');
      const RESERVE_PICK = currentTotal('RESERVE_PICK');
      typeOneTotal = PRODUCTION_TASK + PRODUCTION_LOSS + THREE_GUARANTEES + LOSS_REPORTING + RESERVE_PICK;

      typeOne = [
        {
          title: '生产任务',
          color: '#257BDE',
          numberText: `${PRODUCTION_TASK} (${Math.round((PRODUCTION_TASK / typeOneTotal) * 100) || 0}%)`,
          number: PRODUCTION_TASK,
        },
        {
          title: '三包服务',
          color: '#D8D8D8',
          numberText: `${THREE_GUARANTEES} (${Math.round((THREE_GUARANTEES / typeOneTotal) * 100) || 0}%)`,
          number: THREE_GUARANTEES,
        },
        {
          title: '备品备件',
          color: '#2EAF5D',
          numberText: `${RESERVE_PICK} (${Math.round((RESERVE_PICK / typeOneTotal) * 100) || 0}%)`,
          number: RESERVE_PICK,
        },
        {
          title: '生产损耗',
          color: '#FA8F2B',
          numberText: `${PRODUCTION_LOSS} (${Math.round((PRODUCTION_LOSS / typeOneTotal) * 100) || 0}%)`,
          number: PRODUCTION_LOSS,
        },
        {
          title: '报损出库',
          color: '#FF3131',
          numberText: `${LOSS_REPORTING} (${Math.round((LOSS_REPORTING / typeOneTotal) * 100) || 0}%)`,
          number: LOSS_REPORTING,
        },
      ];

      const outStockComplete = currentTotal(99);
      const outStockIng = currentTotal(0) + currentTotal(null, [0, 49, 50, 99]);
      const outStockRevoke = currentTotal(49);
      typeTwoTotal = outStockComplete + outStockIng + outStockRevoke;

      typeTwo = [
        {
          title: '已完成',
          color: '#257BDE',
          numberText: `${outStockComplete} (${Math.round((outStockComplete / typeTwoTotal) * 100) || 0}%)`,
          number: outStockComplete,
        },
        {
          title: '执行中',
          color: '#FA8F2B',
          numberText: `${outStockIng} (${Math.round((outStockIng / typeTwoTotal) * 100) || 0}%)`,
          number: outStockIng,
        },
        {
          title: '已撤销',
          color: '#D8D8D8',
          numberText: `${outStockRevoke} (${Math.round((outStockRevoke / typeTwoTotal) * 100) || 0}%)`,
          number: outStockRevoke,
        },
      ];
      break;
    case 'comprehensive':
      const inStockNumber = 1;
      const outStockNumber = 2;
      const stocktaskingNumber = 3;
      const maintenanceNumber = 4;
      const allocatiuonNumber = 5;
      typeOneTotal = inStockNumber + outStockNumber + stocktaskingNumber + maintenanceNumber + allocatiuonNumber;
      typeOne = [
        {
          title: '入库',
          color: '#257BDE',
          numberText: `${inStockNumber} (${Math.round((inStockNumber / typeOneTotal) * 100) || 0}%)`,
          number: inStockNumber,
        },
        {
          title: '出库',
          color: '#2EAF5D',
          numberText: `${outStockNumber} (${Math.round((outStockNumber / typeOneTotal) * 100) || 0}%)`,
          number: outStockNumber,
        },
        {
          title: '盘点',
          color: '#82B3EA',
          numberText: `${stocktaskingNumber} (${Math.round((stocktaskingNumber / typeOneTotal) * 100) || 0}%)`,
          number: stocktaskingNumber,
        },
        {
          title: '养护',
          color: '#FA8F2B',
          numberText: `${maintenanceNumber} (${Math.round((maintenanceNumber / typeOneTotal) * 100) || 0}%)`,
          number: maintenanceNumber,
        },
        {
          title: '调拨',
          color: '#FF3131',
          numberText: `${allocatiuonNumber} (${Math.round((allocatiuonNumber / typeOneTotal) * 100) || 0}%)`,
          number: allocatiuonNumber,
        },
      ];


      const comprehensiveComplete = currentTotal(99);
      const comprehensiveIng = currentTotal(0) + currentTotal(null, [0, 49, 50, 99]);
      const comprehensiveRevoke = currentTotal(49);
      typeTwoTotal = comprehensiveComplete + comprehensiveIng + comprehensiveRevoke;

      typeTwo = [
        {
          title: '已完成',
          color: '#257BDE',
          numberText: `${0} (${Math.round((0 / 1) * 100) || 0}%)`,
          number: 1,
        },
        {
          title: '执行中',
          color: '#FA8F2B',
          numberText: `${0} (${Math.round((0 / 1) * 100) || 0}%)`,
          number: 0,
        },
        {
          title: '已撤销',
          color: '#D8D8D8',
          numberText: `${0} (${Math.round((0 / 1) * 100) || 0}%)`,
          number: 0,
        },
        {
          title: '已超期',
          color: '#FF3131',
          numberText: `${1} (${Math.round((1 / 1) * 100) || 0}%)`,
          number: 1,
        },
      ];
      break;
    case 'stockReport':
      const normal = 1;
      const error = 2;
      typeOneTotal = normal + error;
      typeOne = [
        {
          title: '正常',
          color: '#257BDE',
          numberText: `1 类  ${normal} 件 (${Math.round((normal / typeOneTotal) * 100) || 0}%)`,
          number: normal,
        },
        {
          title: '异常',
          color: '#2EAF5D',
          numberText: <>
            {`1 类  ${error} 件 (${Math.round((error / typeOneTotal) * 100) || 0}%)`}
            <LinkButton style={{ marginLeft: 8 }}>详情</LinkButton>
          </>,
          number: error,
        },
      ];


      const type1 = 1;
      const type2 = 2;
      typeTwoTotal = type1 + type2;

      typeTwo = [
        {
          title: '零件',
          color: '#257BDE',
          numberText: `1 类  ${type1} 件 (${Math.round((type1 / typeTwoTotal) * 100) || 0}%)`,
          number: type1,
        },
        {
          title: '标准件',
          color: '#2EAF5D',
          numberText: `1 类  ${type2} 件 (${Math.round((type2 / typeTwoTotal) * 100) || 0}%)`,
          number: type2,
        },
      ];
      break;
    default:
      break;
  }

  const data = type === searchTypes[0].type ? typeOne : typeTwo;

  let total = 0;

  data.forEach(item => total += item.number);

  if (outLoading || inLoading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.taskReport)}>
    <div className={styles.taskReportHeader}>
      <div className={styles.taskReportLabel}>{title || '任务统计'}</div>
      <div className={styles.taskReportType}>
        {
          searchTypes.map((item, index) => {
            return <div
              key={index}
              onClick={() => {
                getData(item.type);
                setType(item.type);
              }}
              className={type === item.type ? styles.taskReportTypeChecked : ''}
            >
              {item.text}
            </div>;
          })
        }
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
            (type === searchTypes[0].type ? typeOne : typeTwo).map((item, index) => {
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
