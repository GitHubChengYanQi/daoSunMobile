import React from 'react';
import styles from '../../index.less';
import { RightOutline } from 'antd-mobile-icons';
import { Chart, Interval } from '@antv/f2';
import Canvas from '@antv/f2-react';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import ScreenButtons from '../ScreenButtons';
import moment from 'moment';

export const InStockArrivalChart = ({ data, detail }) => {

  const history = useHistory();

  const Text = (props, context) => {
    const { coord } = props;
    const { center } = coord;
    return (
      <group
        style={{
          left: center.x,
          top: center.y - context.px2hd('50px'),
          width: '100px',
        }}
      >
        <text
          attrs={{
            text: '到货',
            fill: '#8D8D8D',
            textAlign: 'center',
            fontSize: 12,
          }}
        />
        <text
          style={{ marginTop: '10px' }}
          attrs={{
            text: (data.detailSkuCount || 0) + ' 类',
            fill: '#000',
            textAlign: 'center',
            fontSize: 12,
          }}
        />
        <text
          style={{ marginTop: '10px' }}
          attrs={{
            text: (data.detailNumberCount || 0) + ' 件',
            fill: '#000',
            textAlign: 'center',
            fontSize: 12,
          }}
        />
      </group>
    );
  };

  const total = (data.detailNumberCount || 0);

  const inStock = Math.round((data.logNumberCount / total) * 100) || 0;
  const errorInStock = Math.round((data.errorNumberCount / total) * 100) || 0;

  return <div className={styles.cartData}>
    <div onClick={() => {
      if (!detail) {
        history.push({
          pathname: '/Report/ReportDetail',
          search: 'type=receiptDetails&receiptType=receipt&receiptTypeName=收货',
        });
      }
    }}>
      <Canvas pixelRatio={window.devicePixelRatio} width={100} height={100}>
        <Chart
          data={[{ title: '已入库', number: data.logSkuCount || 0 }, { title: '未入库', number: data.errorSkuCount || 0 }]}
          coord={{
            type: 'polar',
            transposed: true,
            radius: 1.5,
            innerRadius: 0.8,
          }}
        >
          <Interval
            x='a'
            y='number'
            adjust='stack'
            color={{
              field: 'title',
              range: ['#257BDE', '#ff0000'],
            }}
          />
          <Text />
        </Chart>
      </Canvas>
    </div>
    <div className={styles.showTotal}>
      <div className={styles.total} onClick={() => {
        if (!detail) {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=receiptDetails&receiptType=in&receiptTypeName=已入库',
          });
        }
      }}>
        <div className={styles.totalTitle}>已入库</div>
        <div>
          <span className='numberBlue'>{data.logSkuCount || 0}</span>类
          <span className='numberBlue'>{data.logNumberCount || 0}</span>件
        </div>
      </div>
      <div className={styles.total} onClick={() => {
        if (!detail) {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=receiptDetails&receiptType=noIn&receiptTypeName=未入库',
          });
        }
      }}>
        <div className={styles.totalTitle}>未入库</div>
        <div>
          <span className='numberRed'>{data.errorSkuCount || 0}</span>类
          <span className='numberRed'>{data.errorNumberCount || 0}</span>件
        </div>
      </div>
    </div>
  </div>;
};

const defaultTime = [
  moment().month(moment().month()).startOf('month').format('YYYY/MM/DD 00:00:00'),
  moment().month(moment().month()).endOf('month').format('YYYY/MM/DD 23:59:59'),
];
export const viewTotail = {
  url: '/statisticalView/viewTotail',
  method: 'POST',
  data: {},
  // data: { beginTime: defaultTime[0], endTime: defaultTime[1] },
};

const Arrival = ({ title }) => {

  const history = useHistory();

  const { loading, data, run } = useRequest(viewTotail);

  if (!data) {
    if (loading) {
      return <MyLoading skeleton />;
    }
  }

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.action} onClick={() => {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=inStockArrival',
          });
        }}>
          共 <span className='numberBlue'>{data?.customerCount || 0}</span>家
          <RightOutline />
        </div>
      </div>
      <div className={styles.content}>
        <ScreenButtons onChange={(value) => {
          run({ data: { beginTime: value[0], endTime: value[1] } });
        }} />
        <InStockArrivalChart data={data || {}} />
      </div>

      {loading && <MyLoading />}
    </div>
  </>;
};


export default Arrival;
