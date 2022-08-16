import React, { useState } from 'react';
import MyCard from '../../components/MyCard';
import InventoryRotation from '../components/InventoryRotation';
import MyNavBar from '../../components/MyNavBar';
import MyCheck from '../../components/MyCheck';
import { Space } from 'antd-mobile';
import style from '../StatisticalChart/index.less';

const DaysInStock = () => {

  const years = ['1个月内', '3个月内', '6个月内', '长期呆滞'];

  const [data, setData] = useState([]);

  const [skuClass, setSkuClass] = useState([]);

  const [view, setView] = useState('class');

  return <>
    <MyNavBar title='在库天数' />
    <MyCard title='分析图表'>
      <InventoryRotation onChange={(data) => {
        const skuClass = [];
        data.forEach(item => {
          if (!skuClass.includes(item.name)) {
            skuClass.push(item.name);
          }
        });
        setSkuClass(skuClass);
        setData(data);
      }} />
    </MyCard>

    <MyCard title='分类明细' extra={<Space>
      <Space><MyCheck checked={view === 'class'} onChange={() => setView('class')}>查看类数</MyCheck></Space>
      <Space><MyCheck checked={view === 'piece'} onChange={() => setView('piece')}>查看件数</MyCheck></Space>
    </Space>}>
      <div className={style.tr}>
        <div className={style.tdTitle} style={{ height: 32 }} />
        {
          years.map((item, index) => {
            return <div key={index} className={style.td}>
              {item}
            </div>;
          })
        }
      </div>
      {
        skuClass.map((skuClassItem, skuClassIndex) => {
          return <div key={skuClassIndex} className={style.tr}>
            <div key={skuClassIndex} className={style.tdTitle}>
              {skuClassItem}
            </div>
            {
              years.map((yearItem, yearIndex) => {
                const {
                  value,
                  num,
                } = data.filter(item => item.month === yearItem && item.name === skuClassItem)[0] || {};
                return <div key={yearIndex} className={style.td}>
                  {view === 'class' ? (num || 0) : (value || 0)}
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
