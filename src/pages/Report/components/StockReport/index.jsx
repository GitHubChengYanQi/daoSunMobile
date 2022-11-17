import React, { useEffect, useState } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames, isArray } from '../../../components/ToolUtil';
import Canvas from '@antv/f2-react';
import { Chart, Interval, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';

const StockReport = (
  {
    size,
    gap,
  },
) => {

  const [type, setType] = useState('ORDER_STATUS');

  const normal = 1;
  const error = 2;
  const statusDescribeTotal = normal + error;

  const statusDescribe = [
    {
      title: '正常',
      color: '#257BDE',
      numberText: `1 类  ${normal} 件 (${Math.round((normal / statusDescribeTotal) * 100) || 0}%)`,
      number: normal,
    },
    {
      title: '异常',
      color: '#2EAF5D',
      numberText: <>
        {`1 类  ${error} 件 (${Math.round((error / statusDescribeTotal) * 100) || 0}%)`}
        <LinkButton style={{marginLeft:8}}>详情</LinkButton>
      </>,
      number: error,
    },
  ];

  const type1 = 1;
  const type2 = 2;
  const typeDescribeTotal = type1 + type2;
  const typeDescribe = [
    {
      title: '零件',
      color: '#257BDE',
      numberText: `1 类  ${type1} 件 (${Math.round((type1 / typeDescribeTotal) * 100) || 0}%)`,
      number: type1,
    },
    {
      title: '标准件',
      color: '#2EAF5D',
      numberText: `1 类  ${type2} 件 (${Math.round((type2 / typeDescribeTotal) * 100) || 0}%)`,
      number: type2,
    },
  ];

  const data = type === 'ORDER_TYPE' ? typeDescribe : statusDescribe;

  let total = 0;

  data.forEach(item => total += item.number);

  return <div className={classNames(styles.card, styles.taskReport)}>
    <div className={styles.taskReportHeader}>
      <div className={styles.taskReportLabel}>库存统计</div>
      <div className={styles.taskReportType}>
        <div
          onClick={() => {
            setType('ORDER_STATUS');
          }}
          className={type === 'ORDER_STATUS' ? styles.taskReportTypeChecked : ''}
        >
          状态
        </div>
        <div
          onClick={() => {
            setType('ORDER_TYPE');
          }}
          className={type === 'ORDER_TYPE' ? styles.taskReportTypeChecked : ''}
        >
          分类
        </div>
      </div>
    </div>

    <div className={styles.taskRepoetChart}>
      <div>
        <Canvas pixelRatio={window.devicePixelRatio} width={100} height={100}>
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

export default StockReport;
