import React from 'react';
import MyCard from '../../components/MyCard';
import InventoryRotation from '../components/InventoryRotation';
import MyNavBar from '../../components/MyNavBar';
import MyCheck from '../../components/MyCheck';
import { Space } from 'antd-mobile';
import style from '../StatisticalChart/index.less';

const DaysInStock = () => {

  const date = ['一个月内', '三个月内', '六个月内', '长期呆滞'];

  return <>
    <MyNavBar title='在库天数' />
    <MyCard title='分析图表'>
      <InventoryRotation />
    </MyCard>

    <MyCard title='物料明细' extra={<Space>
      <div><MyCheck>查看类数</MyCheck></div>
      <div><MyCheck>查看件数</MyCheck></div>
    </Space>}>
      <div className={style.tr}>
        <div className={style.tdTitle} style={{height:32}} />
        {
          date.map((item, index) => {
            return <div key={index} className={style.td}>
              {item}
            </div>;
          })
        }
      </div>
      {
        [1, 2, 3].map((item, index) => {
          return <div key={index} className={style.tr}>
            <div key={index} className={style.tdTitle}>
              {item}
            </div>
            {
              date.map((item, index) => {
                return <div key={index} className={style.td}>
                  123
                </div>;
              })
            }
          </div>;
        })
      }
    </MyCard>
  </>;
};

export default DaysInStock;
