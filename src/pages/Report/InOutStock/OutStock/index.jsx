import React, { useState } from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import MyCard from '../../../components/MyCard';
import { Space } from 'antd-mobile';
import Icon from '../../../components/Icon';
import MyFloatingBubble from '../../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';
import MyList from '../../../components/MyList';

export const OutStockDataList = { url: '/statisticalView/outstockView', method: 'POST' };

const OutStock = () => {

  const history = useHistory();

  const [list, setList] = useState([]);

  return <>
    <div className={style.total}>
      <div className={style.number}>
        <Icon type='icon-rukuzongshu' style={{marginRight:8,fontSize:18}} />
        出库总数
        <span className='numberBlue'>216</span>类
        <span className='numberBlue'>10342</span>件
      </div>
    </div>

    <MySearch placeholder='搜索' style={{ marginTop: 8, padding: '8px 12px', marginBottom: 4 }} />

    <MyList api={OutStockDataList} data={list} getData={setList}>
      {
        list.map((item, index) => {
          return <MyCard
            key={index}
            onClick={() => {
              history.push({
                pathname: '/Report/InOutStock/OutStock/OutStockDetail',
                query: {
                  userId: 1,
                },
              });
            }}
            className={style.card}
            headerClassName={style.cardHeader}
            titleBom={<Space align='center'>
              <div className={style.yuan} />
              程彦祺
            </Space>}
          >
            <div className={style.info}>
              <div>
                <div className={style.numberTitle}>领料数量</div>
                <div className={style.cardNum}>
                  <span className='numberBlue'>65</span>类
                  <span style={{ marginLeft: 4 }} className='numberBlue'>880</span>件
                </div>
              </div>
              <div>
                <div className={style.numberTitle}>出库数量</div>
                <div className={style.cardNum}>
                  <span className='numberBlue'>65</span>类
                  <span style={{ marginLeft: 4 }} className='numberBlue'>880</span>件
                </div>
              </div>
            </div>
          </MyCard>;
        })
      }
    </MyList>

    <MyFloatingBubble><Icon type='icon-download-2-fill' /></MyFloatingBubble>;
  </>;
};

export default OutStock;
