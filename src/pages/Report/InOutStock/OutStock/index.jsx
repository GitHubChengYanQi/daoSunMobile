import React, { useEffect, useRef, useState } from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import MyCard from '../../../components/MyCard';
import { Space } from 'antd-mobile';
import Icon from '../../../components/Icon';
import MyFloatingBubble from '../../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';
import MyList from '../../../components/MyList';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';

export const OutStockDataList = { url: '/statisticalView/outstockView', method: 'POST' };
export const OutStockDataView = { url: '/statisticalView/outstockViewTotail', method: 'POST' };

const OutStock = (
  {
    date = [],
  },
) => {

  const history = useHistory();

  const listRef = useRef();

  const [list, setList] = useState([]);

  const [search, setSearch] = useState('');

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({ ...OutStockDataView, data: {} });

  useEffect(() => {
    if (date.length > 0) {
      viewRun({ data: { beginTime: date[0], endTime: date[1] } });
      listRef.current.submit({ beginTime: date[0], endTime: date[1] });
    }
  }, [date]);

  return <>
    <div className={style.total}>
      <div className={style.number}>
        <Icon type='icon-rukuzongshu' style={{ marginRight: 8, fontSize: 18 }} />
        出库总数
        <span className='numberBlue'>{view?.outSkuCount || 0}</span>类
        <span className='numberBlue'>{view?.outNumCount || 0}</span>件
      </div>
    </div>

    <MySearch
      value={search}
      placeholder='搜索'
      style={{ marginTop: 8, padding: '8px 12px', marginBottom: 4 }}
      onChange={setSearch}
      onClear={() => {
        listRef.current.submit({ beginTime: date[0], endTime: date[1], skuName: '' });
      }}
      onSearch={(value) => {
        listRef.current.submit({ beginTime: date[0], endTime: date[1], skuName: value });
      }}
    />

    <MyList ref={listRef} api={OutStockDataList} data={list} getData={setList}>
      {
        list.map((item, index) => {
          return <MyCard
            key={index}
            onClick={() => {
              history.push({
                pathname: '/Report/InOutStock/OutStock/OutStockDetail',
                query: {
                  userId: item.userId,
                  userName:item.userResult?.name
                },
              });
            }}
            className={style.card}
            headerClassName={style.cardHeader}
            titleBom={<Space align='center'>
              <div className={style.yuan} />
              {item.userResult?.name}
            </Space>}
          >
            <div className={style.info}>
              <div>
                <div className={style.numberTitle}>领料数量</div>
                <div className={style.cardNum}>
                  <span className='numberBlue'>{item.pickSkuCount || 0}</span>类
                  <span style={{ marginLeft: 4 }} className='numberBlue'>{item.pickNumCount || 0}</span>件
                </div>
              </div>
              <div>
                <div className={style.numberTitle}>出库数量</div>
                <div className={style.cardNum}>
                  <span className='numberBlue'>{item.outSkuCount || 0}</span>类
                  <span style={{ marginLeft: 4 }} className='numberBlue'>{item.outNumCount || 0}</span>件
                </div>
              </div>
            </div>
          </MyCard>;
        })
      }
    </MyList>

    {(viewtLoading) && <MyLoading />}

    <MyFloatingBubble><Icon type='icon-download-2-fill' /></MyFloatingBubble>
  </>;
};

export default OutStock;
