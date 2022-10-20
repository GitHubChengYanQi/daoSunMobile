import React from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import MyCard from '../../../components/MyCard';
import { FloatingBubble, Space } from 'antd-mobile';
import Icon from '../../../components/Icon';
import { useHistory, useLocation } from 'react-router-dom';
import MyFloatingBubble from '../../../components/FloatingBubble';

const InStock = () => {

  const { query } = useLocation();
  console.log(query);

  const history = useHistory();

  return <>
    <div className={style.total}>
      <div className={style.number}>入库总数 <span className='numberBlue'>216</span>类 <span
        className='numberBlue'>10342</span>件
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

    <MySearch placeholder='请输入供应商相关信息' style={{ marginTop: 8, padding: '8px 12px', marginBottom: 4 }} />

    {
      [1, 2].map((item, index) => {
        return <MyCard
          onClick={() => {
            history.push({
              pathname: '/Report/InOutStock/InStock/InStockDetail',
              query: {
                customerId: 1,
              },
            });
          }}
          key={index}
          className={style.card}
          headerClassName={style.cardHeader}
          titleBom={<Space align='center'>
            <div className={style.yuan} />
            辽宁辽工智能装备制造有限公司
          </Space>}
        >
          <div className={style.info}>
            <div>
              <div className={style.numberTitle}>到货数量</div>
              <div className={style.cardNum}>
                <span>65</span>类
                <span style={{ marginLeft: 4 }}>880</span>件
              </div>
            </div>
            <div>
              <div className={style.numberTitle}>入库数量</div>
              <div className={style.cardNum}>
                <span className='numberBlue'>65</span>类
                <span style={{ marginLeft: 4 }} className='numberBlue'>880</span>件
              </div>
            </div>
            <div>
              <div className={style.numberTitle}>退货数量</div>
              <div className={style.cardNum}>
                <span className='numberRed'>65</span>类
                <span style={{ marginLeft: 4 }} className='numberRed'>880</span>件
              </div>
            </div>
          </div>
        </MyCard>;
      })
    }

    <MyFloatingBubble><Icon type='icon-download-2-fill' /></MyFloatingBubble>
  </>;
};

export default InStock;
