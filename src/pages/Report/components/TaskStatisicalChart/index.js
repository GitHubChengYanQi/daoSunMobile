import React from 'react';
import Canvas from '@antv/f2-react';
import { Chart, Interval } from '@antv/f2';
import style from '../../StatisticalChart/index.less';
import { useHistory } from 'react-router-dom';
import { MyLoading } from '../../../components/MyLoading';
import { useRequest } from '../../../../util/Request';

export const taskCountView = { url: '/statisticalView/taskCountView', method: 'GET' };

const TaskStatisicalChart = () => {

  const history = useHistory();

  const { loading, data: taskCount } = useRequest(taskCountView);

  const taskDetail = taskCount || {};

  const data = [
    {
      name: '完成',
      percent: taskDetail.doneCount,
      a: '1',
    },
    {
      name: '执行中',
      percent: taskDetail.startingCount,
      a: '1',
    },
    {
      name: '超期',
      percent: taskDetail.overdueCount,
      a: '1',
    },
  ];

  const total = taskDetail.doneCount + taskDetail.startingCount + taskDetail.overdueCount;

  const donePercent = parseInt((taskDetail.doneCount / total) * 100);
  const startingPercent = parseInt((taskDetail.startingCount / total) * 100);

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <div className={style.flexCenter} onClick={() => {
    const pathname = history.location.pathname;
    const url = '/Report/TaskData';
    if (pathname !== url) {
      history.push(url);
    }
  }}>
    <div className={style.flexGap}>
      <div style={{ fontSize: 14 }}>全部任务
        <span className='numberBlue' style={{ fontSize: 16 }}>{total || 0}</span>个
      </div>
      <div className={style.row}>
        <span style={{ backgroundColor: '#257BDE' }} className={style.dian} />
        <div>完成 <span className='numberBlue'>{taskDetail.doneCount}</span>个</div>
        ({donePercent || 0}%)
      </div>
      <div className={style.row}>
        <span style={{ backgroundColor: '#FA8F2B' }} className={style.dian} />
        <div> 执行中 <span className='numberBlue'>{taskDetail.startingCount}</span>个</div>
        ({startingPercent || 0}%)
      </div>
      <div className={style.row}>
        <span style={{ backgroundColor: '#EA0000' }} className={style.dian} />
        <div>
          超期 <span className='numberRed'>{taskDetail.overdueCount}</span>个
        </div>
        ({(100 - startingPercent - donePercent)|| 0}%)
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
