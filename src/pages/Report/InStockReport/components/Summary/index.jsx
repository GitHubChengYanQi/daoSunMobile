import React, { useEffect, useState } from 'react';
import { classNames, isArray, isObject, ToolUtil } from '../../../../../util/ToolUtil';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Line, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { useHistory } from 'react-router-dom';
import ScreenButtons from '../ScreenButtons';
import MyEmpty from '../../../../components/MyEmpty';

export const inStockCountViewByMonth = { url: '/statisticalView/instockCountViewByMonth', method: 'POST' };

const Summary = ({title}) => {

  const history = useHistory();

  const [detail, setDetail] = useState();

  const { loading: inStockLoading, run: inStockRun } = useRequest(inStockCountViewByMonth, {
    manual: true,
    onSuccess: (res) => {
      setDetail({
        ...res,
        inStocksNumber: Object.keys(isObject(res?.numberByMonth)).map(item => ({
          'month': item,
          'number': res.numberByMonth[item],
          'name': '已入库',
          sort: parseInt(item.replace('-', '')),
        })).sort((a, b) => a.sort - b.sort),
      });
    },
  });

  useEffect(() => {
    inStockRun({ data: {} });
  }, []);

  const charData = isArray(detail?.inStocksNumber);

  if (!detail) {
    if (inStockLoading) {
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
        search: 'type=inStockSummary',
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
          inStockRun({ data: { beginTime: value[0], endTime: value[1] } });
        }} />
    </div>
    <div>
      <div className={styles.summaryTotalUnit}>
        <div className={styles.unit}>件</div>
        <div>
          <span><span className='numberBlue'>{detail?.inSkuCount || 0}</span>类</span>
          <span><span className='numberBlue'>{detail?.inNumCount || 0}</span>件</span>
        </div>
      </div>

      {charData.length === 0 ? <MyEmpty /> : <Canvas pixelRatio={window.devicePixelRatio} height={140}>
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
      </Canvas>}
    </div>
    {inStockLoading && <MyLoading />}
  </div>;
};

export default Summary;
