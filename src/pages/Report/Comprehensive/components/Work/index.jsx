import React, { useEffect, useState } from 'react';
import { classNames, isArray, ToolUtil } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Legend, Line, Tooltip } from '@antv/f2';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd-mobile';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';
import moment from 'moment';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const taskUserView = {
  url: '/statisticalView/taskUserView',
  method: 'POST',
  // data: {},
  data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};

export const taskLogUserView = {
  url: '/statisticalView/taskLogUserView',
  method: 'POST',
  // data: {},
  data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};

const Work = (
  { title },
) => {

  const [data, setData] = useState([]);

  const searchTypes = [
    { text: '执行', type: 'ing' },
    { text: '发起', type: 'ask' },
  ];

  const [type, setType] = useState(searchTypes[1].type);

  const { loading: taskUserViewLoading, data: taskUserViewData, run: taskUserViewRun } = useRequest(taskUserView, {
    manual: true,
    onSuccess: (res) => {
      const newData = [];
      isArray(res).forEach(item => {
        let type = '';
        switch (item.type) {
          case 'INSTOCK':
            type = '入库';
            break;
          case 'OUTSTOCK':
            type = '出库';
            break;
          case 'Stocktaking':
            type = '盘点';
            break;
          case 'MAINTENANCE':
            type = '养护';
            break;
          case 'ALLOCATION':
            type = '调拨';
            break;
        }
        if (type) {
          newData.push({
            userName: item.userResult?.name || '无',
            number: item.number,
            type,
          });
        }
      })
      setData(newData);
    },
  });

  const { loading: taskLogUserViewLoading, data: taskLogUserViewData, run: taskLogUserViewRun } = useRequest(taskLogUserView, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      const newData = [];
      isArray(res).forEach(item => {
        let type = '';
        switch (item.type) {
          case 'INSTOCK':
            type = '入库';
            break;
          case 'OUTSTOCK':
            type = '出库';
            break;
          case 'Stocktaking':
            type = '盘点';
            break;
          case 'MAINTENANCE':
            type = '养护';
            break;
          case 'ALLOCATION':
            type = '调拨';
            break;
        }
        if (type) {
          newData.push({
            userName: item.userResult?.name || '无',
            number: item.number,
            type,
          });
        }
      })
      setData(newData);
    },
  });

  useEffect(() => {
    switch (type) {
      case 'ing':
        taskLogUserViewRun({ data: { beginTime: defaultTime[0], endTime: defaultTime[1] } });
        break;
      case 'ask':
        taskUserViewRun({ data: { beginTime: defaultTime[0], endTime: defaultTime[1] } });
        break;
    }
  }, [type]);

  if (!taskUserViewData && taskUserViewLoading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
    </div>
    <div className={styles.rankingHeader}>
      <ScreenButtons onChange={(value) => {
        switch (type) {
          case 'ing':
            taskLogUserViewRun({ data: { beginTime: value[0], endTime: value[1] } });
            break;
          case 'ask':
            taskUserViewRun({ data: { beginTime: value[0], endTime: value[1] } });
            break;
        }
      }} />
      <div className={styles.searchTypes}>
        {
          searchTypes.map((item, index) => {
            return <div
              key={index}
              onClick={() => {
                setType(item.type);
              }}
              className={type === item.type ? styles.searchTypesChecked : ''}
            >
              {item.text}
            </div>;
          })
        }
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
            }}
            position='top' />
          <Axis field='userName' />
          <Axis field='number' />
          <Interval
            x='userName'
            y='number'
            color={{
              field: 'type',
              range: ['#257BDE', '#82B3EA', '#2EAF5D', '#FA8F2B', '#FF3131'],
            }}
            adjust={{
              type: 'dodge',
              marginRatio: 0, // 设置分组间柱子的间距
            }}
          />
        </Chart>
      </Canvas>
    </div>}
    {taskUserViewLoading && <MyLoading />}
  </div>;
};

export default Work;
