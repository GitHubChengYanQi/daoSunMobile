import React, { useState } from 'react';
import { classNames, isArray } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import Icon from '../../../../components/Icon';

export const outStockDetailView = { url: '/statisticalView/outStockLogView', method: 'POST', data: {} };

const Contrast = (
  {},
) => {

  const history = useHistory();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const {
    loading: outStockDetailViewLoading,
    data: logData,
  } = useRequest(outStockDetailView, {
      onSuccess: (res) => {
        setData([...isArray(res?.logViews?.records).map(item => {
          return { userName: item.userResult?.name || '无', number: item.orderCount, type: '次数' };
        }), ...isArray(res?.logDetailViews?.records).map(item => {
          return { userName: item.userResult?.name || '无', number: item.inNumCount, type: '件数' };
        })]);
        setTotal(res?.logViews?.total > res?.logDetailViews?.total ? res?.logViews?.total : res?.logDetailViews?.total);
      },
    },
  );

  if (!logData) {
    if (outStockDetailViewLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        <Icon type='icon-rukuzongshu' />
        <div style={{ fontSize: 14 }}>排行对比</div>
      </div>
      <div className={styles.action} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=outAskNumber',
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
            position='top' />
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
