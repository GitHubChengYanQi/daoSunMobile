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

export const billPageList = { url: '/statisticalView/billPageList', method: 'POST' };

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
  ];

  const getTitle = (type) => {
    const tab = tabs.filter(item => item.type === type)[0] || {};
    return tab.title;
  };

  const [data, setData] = useState([1, 2]);

  const [total, setTotal] = useState(0);

  const orderListRef = useRef();

  const screenRef = useRef();

  const [screen, setScreen] = useState();

  const [screening, setScreeing] = useState();

  const [params, setParams] = useState({});

  const submit = (data = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    setScreeing(true);
    listRef.current.submit(newParmas);
  };

  const clear = () => {
    setParams({});
    listRef.current.submit({});
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
                  history.push(`/Report/OrderLog?id=${1}`);
                }}
              >
                <div className={ToolUtil.classNames(style.row, style.title)}>
                  {getTitle(type)}记录单 /{item.coding}
                </div>
                <div className={style.time}><Space>{MyDate.Show(item.createTime)}<RightOutline /></Space></div>
              </div>;
            })
          }
        </MyList>
      </div>
    </MyCard>
    <OrderDataScreen
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
