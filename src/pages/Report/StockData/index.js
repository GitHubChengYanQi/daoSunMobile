import React, { useState } from 'react';
import MyCard from '../../components/MyCard';
import Stock from '../components/Stock';
import MyNavBar from '../../components/MyNavBar';
import { Space } from 'antd-mobile';
import LinkButton from '../../components/LinkButton';
import style from '../StatisticalChart/index.less';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import MyEmpty from '../../components/MyEmpty';
import MyAntPopup from '../../components/MyAntPopup';
import InkindList from './components/InkindList';
import { ToolUtil } from '../../components/ToolUtil';

export const stockDetails = { url: '/stockDetails/detailed', method: 'GET' };

const StockData = () => {

  const { loading, data } = useRequest(stockDetails);

  const [inkindIds, setInkindIds] = useState([]);

  const [viewAll, setViewAll] = useState();

  if (loading) {
    return <MyLoading skeleton />;
  }

  return <>
    <MyNavBar title='库存统计' />
    <MyCard title='分析图表'>
      <Stock action viewError={() => setViewAll(true)} />
    </MyCard>

    <MyCard title='分类明细' bodyClassName={style.stockBody}>
      {ToolUtil.isArray(data).length === 0 && <MyEmpty />}
      {
        ToolUtil.isArray(data).map((item, index) => {
          return <MyCard
            className={style.card}
            headerClassName={style.header}
            bodyClassName={style.body}
            titleBom={item.spuClass}
            key={index}
            extra={<Space align='center'>
              合计 <span className='numberBlue'>{item.num}</span>类 <span className='numberBlue'>{item.count}</span>件
            </Space>}
          >
            <div className={style.flexCenter}>
              <div className={style.row}>正常
                <span className='numberBlue'>{item.normalNum}</span>类
                <span className='numberBlue'>{item.normalCount}</span>件
              </div>
              <div className={style.row}>异常
                <span className='numberRed'>{item.errorNum}</span>类
                <span className='numberRed'>{item.errorCount}</span>件
              </div>
              <LinkButton disabled={item.errorCount === 0} onClick={() => {
                setInkindIds(item.errorInkindIds);
              }}>查看异常件</LinkButton>
            </div>

          </MyCard>;
        })
      }
    </MyCard>

    <MyAntPopup
      title='异常件明细'
      visible={viewAll || inkindIds.length > 0}
      onClose={() => {
        setInkindIds([]);
        setViewAll(false);
      }}>
      {(viewAll || inkindIds.length > 0) && <InkindList anomaly={viewAll} inkindIds={inkindIds} />}
    </MyAntPopup>
  </>;
};

export default StockData;
