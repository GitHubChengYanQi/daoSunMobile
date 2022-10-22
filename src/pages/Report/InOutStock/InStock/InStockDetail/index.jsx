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
import { isArray } from '../../../../components/ToolUtil';
import { SkuResultSkuJsons } from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import { InStockViewTotail } from '../index';
import MyEllipsis from '../../../../components/MyEllipsis';

export const instockDetailView = { url: '/statisticalView/instockDetailView', method: 'POST' };

const InStockDetail = () => {

  const { query } = useLocation();

  const customerId = query.customerId;
  const customerName = query.customerName;

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({
    ...InStockViewTotail,
    data: { customerId },
  });

  const { loading, data, run } = useRequest({ ...instockDetailView, data: { customerId } });

  const [date, setDate] = useState([]);

  const history = useHistory();

  if (loading || viewtLoading) {
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
      titleBom={<MyEllipsis>{customerName}</MyEllipsis>}
      extra={<StartEndDate
        precision='day'
        max={new Date()}
        value={date}
        onChange={(date = []) => {
          viewRun({ data: { beginTime: date[0], endTime: date[1], customerId } });
          run({ data: { beginTime: date[0], endTime: date[1], customerId } });
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
          入库总数
          <span className='numberBlue'>{view?.detailSkuCount || 0}</span>类
          <span className='numberBlue'>{view?.detailNumberCount || 0}</span>件
        </div>
        <div className={style.taskTotal} onClick={() => {
          history.push({
            pathname: '/Report/InOutStock/InStock/InStockDetail/InStockTask',
            query: {
              customerId,
              customerName,
            },
          });
        }}>
          <div>任务数</div>
          <div className='numberBlue'>{view?.orderCount || 0}</div>
        </div>
      </div>
      <div className={style.otherNUmber}>
        <div>
          <div>收货总数</div>
          <div className={style.num}>
            <span className='numberBlue'>{view?.logSkuCount || 0}</span>类
            <span style={{ marginLeft: 12 }} className='numberBlue'>{view?.logNumberCount || 0}</span>件
          </div>
        </div>
        <div>
          <div>退货总数</div>
          <div className={style.num}>
            <span className='numberRed'>{view?.errorSkuCount || 0}</span>类
            <span style={{ marginLeft: 12 }} className='numberRed'>{view?.errorNumberCount || 0}</span>件
          </div>
        </div>
      </div>
    </div>

    {
      isArray(data).map((item, index) => {
        return <div key={index} className={style.skuItem}>
          <SkuItem
            skuResult={item.skuResult}
            title={SkuResultSkuJsons({ skuResult: item.skuResult })}
            describe={item.brandResult?.brandName || '无品牌'}
            otherData={[
              <>
                <span className='numberBlue'>入库</span> ×{item.logNum || 0} &nbsp;&nbsp;
                <span className='numberRed'>退货</span>×{item.errorNum || 0}</>,
            ]}
          />
        </div>;
      })
    }
  </>;
};

export default InStockDetail;
