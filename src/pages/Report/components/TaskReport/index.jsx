import React, { useState } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames } from '../../../components/ToolUtil';
import Canvas from '@antv/f2-react';
import { Chart, Interval } from '@antv/f2';

const TaskReport = (
  {
    size,
    module,
    gap,
  },
) => {

  const [type, setType] = useState('type');

  const data = type === 'type' ? [
    {
      'name': '1',
      'number': 4002,
      'typeNum': 12,
    },
    {
      'name': '2',
      'number': 1012,
      'typeNum': 8,
    },
    {
      'name': '3',
      'number': 1012,
      'typeNum': 8,
    },
    {
      'name': '4',
      'number': 1012,
      'typeNum': 8,
    },
  ] : [
    {
      'name': '1',
      'number': 4002,
      'typeNum': 12,
    },
    {
      'name': '2',
      'number': 1012,
      'typeNum': 8,
    },
    {
      'name': '3',
      'number': 1012,
      'typeNum': 8,
    },
  ];

  let typeDescribe = [];
  let statusDescribe = [];

  switch (module) {
    case 'inStock':
      typeDescribe = [
        { title: '物料采购', color: '#257BDE', number: '120 (25%)' },
        { title: '生产完工', color: '#2EAF5D', number: '120 (25%)' },
        { title: '生产退料', color: '#FA8F2B', number: '120 (25%)' },
        { title: '客户退货', color: '#FF3131', number: '120 (25%)' },
      ];
      statusDescribe = [
        { title: '已完成', color: '#257BDE', number: '120 (25%)' },
        { title: '执行中', color: '#FA8F2B', number: '120 (25%)' },
        { title: '已撤销', color: '#D8D8D8', number: '120 (25%)' },
      ];
      break;
    case 'outStock':
      typeDescribe = [
        { title: '生产任务', color: '#257BDE', number: '120 (25%)' },
        { title: '三包服务', color: '#D8D8D8', number: '120 (25%)' },
        { title: '备品备件', color: '#2EAF5D', number: '120 (25%)' },
        { title: '生产损耗', color: '#FA8F2B', number: '120 (25%)' },
        { title: '报损出库', color: '#FF3131', number: '120 (25%)' },
      ];
      statusDescribe = [
        { title: '已完成', color: '#257BDE', number: '120 (25%)' },
        { title: '执行中', color: '#FA8F2B', number: '120 (25%)' },
        { title: '已撤销', color: '#D8D8D8', number: '120 (25%)' },
      ];
      break;
    default:
      break;
  }

  return <div className={classNames(styles.card, styles.taskReport)}>
    <div className={styles.taskReportHeader}>
      <div className={styles.taskReportLabel}>任务统计</div>
      <div className={styles.taskReportType}>
        <div
          onClick={() => setType('type')}
          className={type === 'type' ? styles.taskReportTypeChecked : ''}
        >
          类型
        </div>
        <div
          onClick={() => setType('status')}
          className={type === 'status' ? styles.taskReportTypeChecked : ''}
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
                field: 'name',
                range: type === 'type' ? ['#257BDE', '#2EAF5D', '#FA8F2B', '#FF3131'] : ['#257BDE', '#FA8F2B', '#D8D8D8'],
              }}
            />
          </Chart>
        </Canvas>
      </div>
      <div className={styles.taskReportDescribe}>
        <div>
          <span className={styles.taskReportTotalLabel}>总计</span>
          <span className='numberBlue' style={{ fontSize: 16 }}>160</span>
        </div>
        <div className={styles.taskRepoetChartTypes} style={{gap}}>
          {
            (type === 'type' ? typeDescribe : statusDescribe).map((item, index) => {
              return <div className={styles.taskRepoetChartType} key={index}>
                <span style={{ backgroundColor: item.color }} className={styles.dian} />
                {item.title}
                <span>{item.number}</span>
              </div>;
            })
          }
        </div>
      </div>
    </div>
  </div>;
};

export default TaskReport;
