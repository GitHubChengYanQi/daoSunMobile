import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval } from '@antv/f2';
import style from '../../StatisticalChart/index.less';
import { useHistory } from 'react-router-dom';

const TaskStatisicalChart = () => {

  const history = useHistory();

  const data = [
    {
      name: '完成',
      percent: 0.4,
      a: '1',
    },
    {
      name: '执行中',
      percent: 0.2,
      a: '1',
    },
    {
      name: '超期',
      percent: 0.18,
      a: '1',
    },
  ];

  return <div className={style.flexCenter} onClick={() => {
    history.push('/Report/TaskData');
  }}>
    <div className={style.flexGap}>
      <div style={{ fontSize: 14 }}>全部任务
        <span className='numberBlue' style={{ fontSize: 16 }}>180</span>个
      </div>
      <div>
        <span style={{ backgroundColor: '#257BDE' }} className={style.dian} />
        完成 <span className='numberBlue'>180</span>个(25%)
      </div>
      <div>
        <span style={{ backgroundColor: '#FA8F2B' }} className={style.dian} />
        执行中 <span className='numberBlue'>180</span>个(25%)
      </div>
      <div>
        <span style={{ backgroundColor: '#EA0000' }} className={style.dian} />
        超期 <span className='numberBlue'>180</span>个(25%)
      </div>
    </div>
    <Canvas pixelRatio={window.devicePixelRatio} width={150} height={150}>
      <Chart
        data={data}
        coord={{
          transposed: true,
          type: 'polar',
        }}
      >
        <Interval
          x='a'
          y='percent'
          adjust='stack'
          color={{
            field: 'name',
            range: ['#3662EC', '#FA8F2B', '#EA0000'],
          }}
        />
      </Chart>
    </Canvas>
  </div>;
};

export default TaskStatisicalChart;
