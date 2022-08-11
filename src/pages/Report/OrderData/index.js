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

export const billPageList = { url: '/statisticalView/billPageList', method: 'POST' };

const OrderData = () => {

  const history = useHistory();

  const [tab, setTab] = useState({ title: '入库', type: 'instockLog' });

  const listRef = useRef();

  const tabs = [
    { title: '入库', type: 'instockLog' },
    { title: '出库', type: 'outstockLog' },
    { title: '盘点', type: 'inventoryLog' },
    { title: '养护', type: 'maintenanceLog' },
    { title: '调拨', type: 'allocationLog' },
  ];

  const getTab = (type) => {
    const tab = tabs.filter(item => item.type === type)[0];
    return tab || {};
  };

  const [data, setData] = useState([1, 2]);

  const [total, setTotal] = useState(0);

  return <>
    <MyNavBar title='单据统计' />
    <MyCard title='分析图表'>
      <OrderStatisicalChart />
    </MyCard>
    <MyCard title='单据明细'>
      <Tabs onChange={(key) => {
        listRef.current.submit({type:key});
        setTab(getTab(key));
      }}>
        {
          tabs.map((item) => {
            return <Tabs.Tab title={item.title} key={item.type} />;
          })
        }
      </Tabs>
      <div className={style.total}>
        单据：<span className='numberBlue'>{total}</span>
      </div>
      <MyList
        ref={listRef}
        api={billPageList}
        data={data}
        params={{ type: tab.type }}
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
                {tab.title}记录单 /{item.coding}
              </div>
              <div className={style.time}><Space>{MyDate.Show(item.createTime)}<RightOutline /></Space></div>
            </div>;
          })
        }
      </MyList>
    </MyCard>
  </>;
};

export default OrderData;
