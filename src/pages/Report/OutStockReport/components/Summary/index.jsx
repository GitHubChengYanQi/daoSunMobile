import React, { useEffect, useState } from 'react';
import { classNames, isArray, isObject, ToolUtil } from '../../../../components/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Line, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { useHistory } from 'react-router-dom';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';
import moment from 'moment';
import MyEmpty from '../../../../components/MyEmpty';

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const outstockCountViewByMonth = {
  url: '/statisticalView/outstockCountViewByMonth',
  method: 'POST',
  data: { beginTime: defaultTime[0], endTime: defaultTime[1], frame: 7 },
};

const Summary = () => {

  const history = useHistory();

  const [detail, setDetail] = useState();

  const { loading: outStockLoading, run: outStockRun } = useRequest(outstockCountViewByMonth, {
    onSuccess: (res) => {
      setDetail({
        stocksNumber: res.map(item => ({
          'month': item.monthOfYear,
          'number': item.orderCount,
          'name': '已出库',
        })),
      });
    },
  });

  const charData = isArray(detail?.stocksNumber);
  const title = '出库汇总';

  if (!detail) {
    if (outStockLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
      <div onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=outStockSummary',
      })}>
        <RightOutline />
      </div>
    </div>
    <div className={classNames(styles.flexCenter, styles.dateTotal)}>
      <ScreenButtons
        types={[
          { text: '本月', key: 'month' },
          { text: '本年', key: 'year' },
        ]}
        onChange={(value) => {
          outStockRun({ data: { beginTime: value[0], endTime: value[1], frame: 1 } });
        }} />
    </div>
    <div>
      <div className={styles.summaryTotalUnit}>
        <div className={styles.unit}>件</div>
        <div>
          <span><span className='numberBlue'>0</span>类</span>
          <span><span className='numberBlue'>0</span>件</span>
        </div>
      </div>

      {charData.length === 0 ? <MyEmpty /> : <Canvas pixelRatio={window.devicePixelRatio} height={200}>
        <Chart data={ToolUtil.isArray(charData)}>
          <Axis
            field='month'
            tickCount={12}
            style={{
              label: {
                align: 'end',
                rotate: -0.4,
              },
            }}
          />
          <Axis
            field='number'
            tickCount={5}
          />
          <Line x='month' y='number' color={{
            field: 'name',
            range: ['#257BDE', '#FF3131'],
          }} />
          <Tooltip />
        </Chart>
      </Canvas>}
    </div>
    {outStockLoading && <MyLoading />}
  </div>;
};

export default Summary;
