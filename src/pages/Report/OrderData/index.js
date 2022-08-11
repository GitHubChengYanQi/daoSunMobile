import React, { useState } from 'react';
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

const OrderData = () => {

  const history = useHistory();

  const tabs = [
    { title: '入库' },
    { title: '出库' },
    { title: '盘点' },
    { title: '养护' },
    { title: '调拨' },
  ];

  const [data, setData] = useState([1, 2]);

  return <>
    <MyNavBar title='单据统计' />
    <MyCard title='分析图表'>
      <OrderStatisicalChart />
    </MyCard>
    <MyCard title='单据明细'>
      <Tabs>
        {
          tabs.map((item, index) => {
            return <Tabs.Tab title={item.title} key={index} />;
          })
        }
      </Tabs>
      <div className={style.total}>
        单据：<span className='numberBlue'>50</span>
      </div>
      <MyList data={data}>
        {
          data.map((item, index) => {
            return <div
              key={index}
              className={ToolUtil.classNames(style.flexCenter, style.orderItem)}
              onClick={() => {
                history.push(`/Report/OrderLog?id=${1}`)
              }}
            >
              <div className={style.row}>xxx的记录单 / 113213</div>
              <div className={style.time}><Space>{MyDate.Show(new Date())}<RightOutline /></Space></div>
            </div>;
          })
        }
      </MyList>
    </MyCard>
  </>;
};

export default OrderData;
