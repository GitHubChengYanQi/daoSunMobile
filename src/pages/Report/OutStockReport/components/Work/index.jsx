import React, { useState } from 'react';
import { classNames, isArray, ToolUtil } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, Line, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd-mobile';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { instockLogView } from '../../../InStockReport/components/Work';
import moment from 'moment';
import MyEmpty from '../../../../components/MyEmpty';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const outStockLogView = {
  url: '/statisticalView/outStockLogView',
  method: 'POST',
  data: {},
  // data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};

const Work = (
  {title},
) => {

  const history = useHistory();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const {
    loading: outStockLogViewLoading,
    data: logData,
    run: outStockLogViewRun,
  } = useRequest(outStockLogView, {
    onSuccess: (res) => {
      setData([...isArray(res?.logViews?.records).map(item => {
        return { userName: item.userResult?.name || '无', number: item.orderCount, type: '次数' };
      }), ...isArray(res?.logDetailViews?.records).map(item => {
        return { userName: item.userResult?.name || '无', number: item.inNumCount, type: '件数' };
      })]);
      setTotal(res?.logViews?.total > res?.logDetailViews?.total ? res?.logViews?.total : res?.logDetailViews?.total);
    },
  });

  if (!logData) {
    if (outStockLogViewLoading) {
      return <MyLoading skeleton />;
    }
  }

  // const data = [
  //   { userName: '123', number: 111, type: '次数' },
  //   { userName: '456', number: 234, type: '次数' },
  //   { userName: '123', number: 22, type: '件数' },
  //   { userName: '456', number: 456, type: '件数' },
  // ];

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
      <div className={styles.action} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=outStockWork',
      })}>
        共 <span className='numberBlue'>12</span> 人
        <RightOutline />
      </div>
    </div>
    <div className={classNames(styles.flexCenter, styles.dateTotal)}>
      <ScreenButtons onChange={(value) => {
        outStockLogViewRun({ data: { beginTime: value[0], endTime: value[1] } });
      }} />
    </div>
    {data.length === 0 ? <MyEmpty /> : <div>
      <Canvas pixelRatio={window.devicePixelRatio} height={150}>
        <Chart data={data}>
          <Tooltip />
          <Legend
            marker='square'
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            position='top'
          />
          <Axis field='userName' />
          <Axis field='number' />
          <Interval
            x='userName'
            y='number'
            color='type'
            adjust={{
              type: 'dodge',
              marginRatio: 0, // 设置分组间柱子的间距
            }}
          />
        </Chart>
      </Canvas>
    </div>}

  </div>;
};

export default Work;
