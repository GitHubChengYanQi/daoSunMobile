import React from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import MyCard from '../../../components/MyCard';
import { FloatingBubble, Space } from 'antd-mobile';
import Bouncing from '../../../components/Bouncing';
import waitInstockShop from '../../../../assets/waitInstockShop.png';
import instockErrorShop from '../../../../assets/instockErrorShop.png';
import Icon from '../../../components/Icon';
import MyFloatingBubble from '../../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';

const OutStock = () => {

  const history = useHistory();

  return <>
    <div className={style.total}>
      <div className={style.number}>出库总数 <span className='numberBlue'>216</span>类 <span
        className='numberBlue'>10342</span>件
      </div>
    </div>

    <MySearch placeholder='搜索' style={{ marginTop: 8, padding: '8px 12px', marginBottom: 4 }} />

    {
      [1, 2].map((item, index) => {
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

    <MyFloatingBubble><Icon type='icon-download-2-fill' /></MyFloatingBubble>;
  </>;
};

export default OutStock;
