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

export const outstockCountViewByMonth = { url: '/statisticalView/outstockCountViewByMonth', method: 'POST' };

const Summary = () => {

  const history = useHistory();

  const [detail, setDetail] = useState();

  const { loading: outStockLoading, run: outStockRun } = useRequest(outstockCountViewByMonth, {
    manual: true,
    onSuccess: (res) => {
      setDetail({
        ...res,
        inStocksNumber: Object.keys(isObject(res?.numberByMonth)).map(item => ({
          'month': item,
          'number': res.numberByMonth[item],
          'name': '已出库',
          sort: parseInt(item.replace('-', '')),
        })).sort((a, b) => a.sort - b.sort),
      });
    },
  });

  useEffect(() => {
    outStockRun({ data: {} });
  }, []);

  const charData = [{
    'month': 12,
    'number': 2022,
    'name': '已出库',
  }] || isArray(detail?.inStocksNumber);
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
          outStockRun({ data: { beginTime: value[0], endTime: value[1] } });
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

      <Canvas pixelRatio={window.devicePixelRatio} height={140}>
        <Chart data={ToolUtil.isArray(charData)}>
          <Axis
            field='month'
            tickCount={12}
            style={{
              label: {
                align: 'end',
                rotate: -0.5,
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
      </Canvas>
    </div>
    {outStockLoading && <MyLoading />}
  </div>;
};

export default Summary;
