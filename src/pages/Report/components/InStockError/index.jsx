import React, { useEffect } from 'react';
import styles from '../../InStockReport/index.less';
import { classNames } from '../../../components/ToolUtil';
import { Chart, Interval } from '@antv/f2';
import Canvas from '@antv/f2-react';
import { useRequest } from '../../../../util/Request';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { MyLoading } from '../../../components/MyLoading';

const errorBySpuClass = { url: '/statisticalView/errorBySpuClass', method: 'POST' };

const InStockError = ({ date = [] }) => {

  const history = useHistory();

  const { loading, data: list = [], run } = useRequest(errorBySpuClass, {
    manual: true,
  });

  useEffect(() => {
    run({ data: { beginTime: date[0], endTime: date[1] } });
  }, [date[0], date[1]]);

  const getTypeData = (type) => {
    return list.find(item => item.type === type) || {};
  };

  const PURCHASE_INSTOCK_NUM = getTypeData('PURCHASE_INSTOCK').errorNumCount || 0;
  const PRODUCTION_INSTOCK_NUM = getTypeData('PRODUCTION_INSTOCK').errorNumCount || 0;
  const PRODUCTION_RETURN_NUM = getTypeData('PRODUCTION_RETURN').errorNumCount || 0;
  const CUSTOMER_RETURN_NUM = getTypeData('CUSTOMER_RETURN').errorNumCount || 0;
  const total = PURCHASE_INSTOCK_NUM + PRODUCTION_INSTOCK_NUM + PRODUCTION_RETURN_NUM + CUSTOMER_RETURN_NUM;

  const PURCHASE_INSTOCK_SKU = getTypeData('PURCHASE_INSTOCK').errorSkuCount || 0;
  const PRODUCTION_INSTOCK_SKU = getTypeData('PRODUCTION_INSTOCK').errorSkuCount || 0;
  const PRODUCTION_RETURN_SKU = getTypeData('PRODUCTION_RETURN').errorSkuCount || 0;
  const CUSTOMER_RETURN_SKU = getTypeData('CUSTOMER_RETURN').errorSkuCount || 0;
  const totalSku = PURCHASE_INSTOCK_SKU + PRODUCTION_INSTOCK_SKU + PRODUCTION_RETURN_SKU + CUSTOMER_RETURN_SKU;

  const data = [
    {
      name: '1',
      percent: PURCHASE_INSTOCK_NUM,
      a: '1',
    },
    {
      name: '2',
      percent: PRODUCTION_INSTOCK_NUM,
      a: '1',
    },
    {
      name: '3',
      percent: PRODUCTION_RETURN_NUM,
      a: '1',
    },
    {
      name: '4',
      percent: CUSTOMER_RETURN_NUM,
      a: '1',
    },
  ];

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.inStockError)}>
    <div className={styles.inStockErrorHeard} onClick={() => {
      history.push({
        pathname: '/Report/ReportDetail',
        search: `type=inStockError`,
      });
    }}>
      <div className={styles.title}>异常入库数占比</div>
      <div><RightOutline /></div>
    </div>

    <div className={styles.inStockErrorChart}>
      <Canvas pixelRatio={window.devicePixelRatio} width={150} height={150}>
        <Chart
          data={data}
          coord={{
            transposed: true,
            type: 'polar',
            radius: 1.2,
          }}
        >
          <Interval
            x='a'
            y='percent'
            adjust='stack'
            color={{
              field: 'name',
              range: ['#257BDE', '#2EAF5D', '#FA8F2B', '#FF3131'],
            }}
          />
        </Chart>
      </Canvas>
      <div className={styles.inStockErrorDescribe}>
        <div>
          <span className={styles.inStockErrorTotalLabel}>总计</span>
          <span className='numberBlue' style={{ fontSize: 16 }}>{totalSku}</span>类
          <span className='numberBlue' style={{ fontSize: 16 }}>{total}</span>件
        </div>
        <div className={styles.inStockErrorChartTypes}>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#257BDE' }} className={styles.dian} />
            物料采购
            <span>
              {PURCHASE_INSTOCK_NUM} 类
              &nbsp;
              {PURCHASE_INSTOCK_SKU} 件
              ({Math.round((PURCHASE_INSTOCK_NUM / total) * 100) || 0}%)
            </span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#2EAF5D' }} className={styles.dian} />
            生产完工
            <span>
              {PRODUCTION_INSTOCK_NUM} 类
              &nbsp;
              {PRODUCTION_INSTOCK_SKU} 件
              ({Math.round((PRODUCTION_INSTOCK_NUM / total) * 100) || 0}%)
            </span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#FA8F2B' }} className={styles.dian} />
            生产退料
            <span>
              {PRODUCTION_RETURN_NUM} 类
              &nbsp;
              {PRODUCTION_RETURN_SKU} 件
              ({Math.round((PRODUCTION_RETURN_NUM / total) * 100) || 0}%)
            </span>
          </div>
          <div className={styles.inStockErrorChartType}>
            <span style={{ backgroundColor: '#FF3131' }} className={styles.dian} />
            客户退货
            <span>
              {CUSTOMER_RETURN_NUM} 类
              &nbsp;
              {CUSTOMER_RETURN_SKU} 件
              ({Math.round((CUSTOMER_RETURN_NUM / total) * 100) || 0}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default InStockError;
