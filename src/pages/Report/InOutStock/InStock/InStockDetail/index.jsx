import React, { useState } from 'react';
import MyNavBar from '../../../../components/MyNavBar';
import MySearch from '../../../../components/MySearch';
import MyCard from '../../../../components/MyCard';
import { Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import style from './index.less';
import StartEndDate from '../../../../Work/Production/CreateTask/components/StartEndDate';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import LinkButton from '../../../../components/LinkButton';
import SkuItem from '../../../../Work/Sku/SkuItem';
import Icon from '../../../../components/Icon';
import MyFloatingBubble from '../../../../components/FloatingBubble';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';

export const instockDetailView = { url: '/statisticalView/instockDetailView', method: 'POST' };

const InStockDetail = () => {

  const { query } = useLocation();

  console.log(query);

  const { loading, data } = useRequest({ ...instockDetailView, data: { customerId: query.customerId } });

  const [date, setDate] = useState([]);

  const history = useHistory();

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title='入库统计详情' />
    <div style={{ margin: '1px 0' }}>
      <MySearch placeholder='搜索' />
    </div>
    <MyCard
      className={style.customerCard}
      titleBom='辽宁辽工智能装备制造有限...'
      extra={<StartEndDate
        max={new Date()}
        value={date}
        onChange={setDate}
        render={date.length > 0 ?
          <LinkButton>
            <Space align='center'>
              {moment(date[0]).format('MM/DD') + ' - ' + moment(date[1]).format('MM/DD')}
              <DownOutline style={{ fontSize: 12 }} />
            </Space>
          </LinkButton>
          :
          <Space align='center' className={style.placeholder}>请选择时间范围 <DownOutline style={{ fontSize: 12 }} /></Space>}
      />}
    />
    <div className={style.total}>
      <div className={style.number}>
        <div>
          入库总数
          <span className='numberBlue'>216</span>类
          <span className='numberBlue'>10342</span>件
        </div>
        <div className={style.taskTotal} onClick={() => {
          history.push({
            pathname: '/Report/InOutStock/InStock/InStockDetail/InStockTask',
            query: {
              customerId: 1,
            },
          });
        }}>
          <div>任务数</div>
          <div className='numberBlue'>1558</div>
        </div>
      </div>
      <div className={style.otherNUmber}>
        <div>
          <div>收货总数</div>
          <div className={style.num}>
            <span className='numberBlue'>216</span>类
            <span style={{ marginLeft: 12 }} className='numberBlue'>10342</span>件
          </div>
        </div>
        <div>
          <div>退货总数</div>
          <div className={style.num}>
            <span className='numberRed'>216</span>类
            <span style={{ marginLeft: 12 }} className='numberRed'>10342</span>件
          </div>
        </div>
      </div>
    </div>

    {
      [1, 2].map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <SkuItem
            title='黑色内扣冷却管/lqg-700/ 1/2*700mm黑色...'
            describe='丹东汉克'
            otherData={[
              <><span className='numberBlue'>入库</span> ×50 &nbsp;&nbsp; <span className='numberRed'>退货</span>×30</>,
            ]}
          />
        </div>;
      })
    }
  </>;
};

export default InStockDetail;
