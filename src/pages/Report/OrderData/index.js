import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MyCard from '../../components/MyCard';
import OrderStatisicalChart from '../components/OrderStatisicalChart';
import { Space, Tabs } from 'antd-mobile';
import MyList from '../../components/MyList';
import { MyDate } from '../../components/MyDate';
import style from '../StatisticalChart/index.less';
import { ToolUtil } from '../../components/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import ListScreent from '../../Work/Sku/SkuList/components/ListScreent';
import OrderDataScreen from './components/OrderDataScreen';
import { history } from 'umi';

export const billPageList = { url: '/statisticalView/billPageList', method: 'POST' };

export const LogDetail = ({ type, item }) => {
  let id = '';
  switch (type) {
    case 'instockLog':
      id = item.receiptId;
      break;
    case 'outstockLog':
      id = item.outstockOrderId;
      break;
    case 'inventoryLog':
      id = item.inventoryTaskId;
      break;
    case 'anomaly':
      id = item.orderId;
      break;
    case 'maintenanceLog':
      id = item.maintenanceLogId;
      break;
    case 'allocationLog':
      id = item.allocationLogId;
      break;
    default:
      break;
  }
  history.push({
    pathname: '/Report/OrderLog',
    query: {
      type,
      id,
      time: MyDate.Show(item.createTime),
      coding: item.coding,
    },
  });
};

const OrderData = () => {

  const history = useHistory();

  const { type: orderType } = history.location.query;

  const [type, setType] = useState(orderType || 'instockLog');

  const listRef = useRef();

  const tabs = [
    { title: '入库', type: 'instockLog' },
    { title: '出库', type: 'outstockLog' },
    { title: '盘点', type: 'inventoryLog' },
    { title: '养护', type: 'maintenanceLog' },
    { title: '调拨', type: 'allocationLog' },
    { title: '异常', type: 'anomaly' },
  ];

  const [data, setData] = useState([1, 2]);

  const [total, setTotal] = useState(0);

  const orderListRef = useRef();

  const screenRef = useRef();

  const [screen, setScreen] = useState();

  const [screening, setScreeing] = useState();

  const [params, setParams] = useState({ type });

  const submit = (data = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    setScreeing(true);
    listRef.current.submit(newParmas);
  };

  const clear = () => {
    setParams({ type });
    listRef.current.submit({ type });
  };

  return <>
    <MyNavBar title='单据统计' />
    <MyCard title='分析图表'>
      <OrderStatisicalChart />
    </MyCard>
    <MyCard title='单据明细'>
      <Tabs activeKey={type} onChange={(key) => {
        listRef.current.submit({ type: key });
        setType(key);
      }}>
        {
          tabs.map((item) => {
            return <Tabs.Tab title={item.title} key={item.type} />;
          })
        }
      </Tabs>
      <ListScreent
        className={style.screent}
        top={ToolUtil.isQiyeWeixin() ? 0 : 45}
        screenRef={screenRef}
        screening={screening}
        onlySorts={['createTime']}
        listRef={orderListRef}
        screen={screen}
        screenChange={setScreen}
        numberTitle={<> 单据：<span className='numberBlue'>{total}</span></>}
      />
      <div ref={orderListRef}>
        <MyList
          ref={listRef}
          api={billPageList}
          data={data}
          params={{ type }}
          getData={setData}
          response={(res) => {
            setTotal(res.count);
          }}
        >
          {
            data.map((item, index) => {
              return <div
                key={index}
                className={ToolUtil.classNames(style.flexCenter, style.orderItem)}
                onClick={() => {
                  LogDetail({ type, item });
                }}
              >
                <div className={ToolUtil.classNames(style.row, style.title)}>
                  {item.coding}
                </div>
                <div className={style.time}><Space>{MyDate.Show(item.createTime)}<RightOutline /></Space></div>
              </div>;
            })
          }
        </MyList>
      </div>
    </MyCard>
    <OrderDataScreen
      orderType={type}
      top={ToolUtil.isQiyeWeixin() ? 0 : 45}
      skuNumber={total}
      onClose={() => {
        setScreen(false);
        ToolUtil.isObject(orderListRef.current).removeAttribute('style');
      }}
      params={params}
      onClear={clear}
      screen={screen}
      onChange={(params) => {
        submit(params);
      }} />
  </>;
};

export default OrderData;
