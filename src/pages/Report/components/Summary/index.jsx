import React, { useEffect, useState } from 'react';
import { classNames, isArray, isObject, ToolUtil } from '../../../components/ToolUtil';
import styles from '../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import Canvas from '@antv/f2-react';
import { Axis, Chart, Interval, Line, TextGuide, Tooltip } from '@antv/f2';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { useHistory } from 'react-router-dom';

const inStockCountViewByMonth = { url: '/statisticalView/instockCountViewByMonth', method: 'POST' };
const outstockCountViewByMonth = { url: '/statisticalView/outstockCountViewByMonth', method: 'POST' };

const Summary = (
  {
    date = [],
    module,
  },
) => {

  const history = useHistory();

  const [detail, setDetail] = useState({});

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
        errorsNumber: Object.keys(isObject(res?.errorNumberByMonth)).map(item => ({
          'month': item,
          'number': res.errorNumberByMonth[item],
          'name': '拒绝入库',
          sort: parseInt(item.replace('-', '')),
        })).sort((a, b) => a.sort - b.sort),
      });
    },
  });

  const { loading: outStockLoading, run: outStockRun } = useRequest(outstockCountViewByMonth, {
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
        errorsNumber: Object.keys(isObject(res?.errorNumberByMonth)).map(item => ({
          'month': item,
          'number': res.errorNumberByMonth[item],
          'name': '拒绝入库',
          sort: parseInt(item.replace('-', '')),
        })).sort((a, b) => a.sort - b.sort),
      });
    },
  });

  useEffect(() => {
    switch (module) {
      case 'inStockSummary':
        inStockRun({ data: {} });
        break;
      case 'outStock':
        outStockRun({ data: {} });
        break;
      default:
        break;
    }
  }, []);

  const data1 = new Array(12).fill('').map((item, index) => ({
    'month': '2022/' + (index + 1),
    'number': parseInt(Math.random() * 10),
    'name': '1',
  }));

  let title = '';
  let describe = <></>;
  let charData = [];
  let report = <></>;
  switch (module) {
    case 'inStockSummary':
      charData = [...isArray(detail.inStocksNumber), ...isArray(detail.errorsNumber)];
      title = '物料入库汇总';
      describe = <div>
        <div className={styles.summaryTotalLabel}>
          <span>已入库</span>
          <span><span className='numberBlue'>{detail.inSkuCount}</span>类</span>
          <span><span className='numberBlue'>{detail.inNumCount}</span>件</span>
        </div>
        <div className={styles.summaryTotalLabel}>
          <span>拒绝入库</span>
          <span><span className='numberRed'>{detail.errorSkuCount}</span>类</span>
          <span><span className='numberRed'>{detail.errorNumCount}</span>件</span>
        </div>
      </div>;
      report = <div className={styles.summaryAllCount}>
        <div className={styles.summaryCount}>
          <div>
            已入库
          </div>
          <div className={styles.summaryCountNumber}>
            <span className='numberBlue' style={{ paddingLeft: 0 }}>{detail.inSkuCount}</span>类
            <span className='numberBlue'>{detail.inNumCount}</span>件
          </div>
        </div>
        <div className={styles.summarySpace} />
        <div className={styles.summaryCount}>
          <div>
            拒绝入库
          </div>
          <div className={styles.summaryCountNumber}>
            <span className='numberRed' style={{ paddingLeft: 0 }}>{detail.errorSkuCount}</span>类
            <span className='numberRed'>{detail.errorNumCount}</span>件
          </div>
        </div>
      </div>;
      break;
    case 'outStock':
      charData = data1;
      title = '物料出库汇总';
      describe = <div>
        <div className={styles.summaryTotalLabel}>
          <span>已出库</span>
          <span><span className='numberBlue'>216</span>类</span>
          <span><span className='numberBlue'>10324</span>件</span>
        </div>
      </div>;
      report = <div className={styles.summaryAllCount}>
        <div className={styles.summaryCount}>
          <div>
            <div>
              已出库
            </div>
            <div className={styles.summaryCountNumber}>
              <span className='numberBlue'>216</span>类
              <span className='numberBlue'>216</span>件
            </div>
          </div>
        </div>
      </div>;
      break;
    default:
      break;
  }

  if (inStockLoading || outStockLoading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.summary)}>
    <div className={styles.summaryHeader}>
      <div className={styles.summaryHeaderLabel}>
        {title}
      </div>
      <div onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: `type=${module}`,
      })}>
        <RightOutline />
      </div>
    </div>

    <div hidden={isArray(date).length > 0}>
      <div className={styles.summaryTotal}>
        <div className={styles.summaryTotalUnit}>
          件
        </div>
        {describe}
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

    {isArray(date).length !== 0 && report}

  </div>;
};

export default Summary;
