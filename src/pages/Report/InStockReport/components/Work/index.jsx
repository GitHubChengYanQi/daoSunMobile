import React, { useState } from 'react';
import { classNames, isArray } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, Line, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import moment from 'moment';
import ScreenButtons from '../ScreenButtons';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const instockLogView = {
  url: '/statisticalView/instockLogView',
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
    loading: instockLogViewLoading,
    data:logData,
    run: instockLogViewRun,
  } = useRequest(instockLogView, {
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
    if (instockLogViewLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
      <div  className={styles.action} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=inStockWork',
      })}>
        共 <span className='numberBlue'>{total}</span> 人
        <RightOutline />
      </div>
    </div>
    <div className={classNames(styles.flexCenter, styles.dateTotal)}>
      <ScreenButtons onChange={(value) => {
        instockLogViewRun({ data: { beginTime: value[0], endTime: value[1] } });
      }} />
    </div>
    {data.length === 0 ? <MyEmpty /> : <div>
      <Canvas pixelRatio={window.devicePixelRatio} height={150}>
        <Chart data={data || []}>
          <Tooltip />
          <Legend
            marker='square'
            position='top'
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
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

    {instockLogViewLoading && <MyLoading />}

  </div>;
};

export default Work;
