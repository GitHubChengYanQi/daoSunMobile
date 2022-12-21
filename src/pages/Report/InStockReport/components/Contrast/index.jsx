import React, { useState } from 'react';
import { classNames, isArray } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, TextGuide, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import MyEmpty from '../../../../components/MyEmpty';
import { MyLoading } from '../../../../components/MyLoading';

export const instockOrderCountViewByUser = {
  url: '/statisticalView/instockOrderCountViewByUser',
  method: 'POST',
  data: {},
};

const Contrast = (
  {},
) => {

  const history = useHistory();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const {
    loading: instockLogViewLoading,
    data: logData,
  } = useRequest(instockOrderCountViewByUser, {
      onSuccess: (res) => {
        setData([...isArray(res?.countOrderByUser?.records).map(item => {
          return { userName: item.userResult?.name || '无', number: item.orderCount, type: '次数' };
        }), ...isArray(res?.sumOrderByUser?.records).map(item => {
          return { userName: item.userResult?.name || '无', number: item.inNumCount, type: '件数' };
        })]);
        setTotal(res?.countOrderByUser?.total > res?.countOrderByUser?.total ? res?.countOrderByUser?.total : res?.countOrderByUser?.total);
      },
    },
  );

  if (!logData) {
    if (instockLogViewLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        排行对比
      </div>
      <div className={styles.action} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=inAskNumber',
      })}>
        共 <span className='numberBlue'>{total}</span> 人
        <RightOutline />
      </div>
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

export default Contrast;
