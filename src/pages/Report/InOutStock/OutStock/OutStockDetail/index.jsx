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
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { isArray } from '../../../../components/ToolUtil';
import { OutStockDataView } from '../index';

export const outstockDetailView = { url: '/statisticalView/outStockDetailView', method: 'POST' };

const OutStockDetail = () => {

  const { query } = useLocation();

  const userId = query.userId;
  const userName = query.userName;

  const [date, setDate] = useState([]);

  const history = useHistory();

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({
    ...OutStockDataView,
    data: { userId },
  });

  const { loading, data, run } = useRequest({ ...outstockDetailView, data: { userId } });

  if (loading || viewtLoading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='出库统计详情' />
    <div style={{ margin: '1px 0' }}>
      <MySearch placeholder='搜索' />
    </div>
    <MyCard
      className={style.customerCard}
      titleBom={userName || '-'}
      extra={<StartEndDate
        max={new Date()}
        value={date}
        onChange={(date = []) => {
          viewRun({ data: { beginTime: date[0], endTime: date[1], userId } });
          run({ data: { beginTime: date[0], endTime: date[1], userId } });
          setDate(date);
        }}
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
          <Icon type='icon-rukuzongshu' style={{ marginRight: 8, fontSize: 18 }} />
          出库总数
          <span className='numberBlue'>{view?.outSkuCount || 0}</span>类
          <span className='numberBlue'>{view?.outNumCount || 0}</span>件
        </div>
        <div className={style.taskTotal} onClick={() => {
          history.push({
            pathname: '/Report/InOutStock/OutStock/OutStockDetail/OutStockTask',
            query: {
              userId: 1,
            },
          });
        }}>
          <div>任务数</div>
          <div className='numberBlue'>1558</div>
        </div>
      </div>
    </div>

    {
      isArray(data).map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <SkuItem
            title='黑色内扣冷却管/lqg-700/ 1/2*700mm黑色...'
            describe='丹东汉克'
            otherData={[
              <><span className='numberBlue'>领取</span> ×50 &nbsp;&nbsp; <span>出库</span>×30</>,
            ]}
          />
        </div>;
      })
    }
  </>;
};

export default OutStockDetail;
