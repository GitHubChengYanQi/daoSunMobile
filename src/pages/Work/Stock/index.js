import React, { useState } from 'react';
import { Button, TabBar } from 'antd-mobile';
import Icon from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import StockDetail from './components/StockDetail';
import MyNavBar from '../../components/MyNavBar';

const Stock = () => {

  const [key, setkey] = useState('stock');

  const [overflow,setOverflow] = useState('auto');

  const content = () => {
    switch (key) {
      case 'stock':
        return <StockDetail setOverflow={setOverflow} />;
      default:
        return <MyEmpty height='100%' />;
    }
  };


  return <div className={style.pageIndex}>
    <MyNavBar title='库存管理' />
    <div className={style.content} style={{overflow}}>
      {content()}
    </div>
    <TabBar
      className={style.tabBarItem}
      safeArea
      activeKey={key}
      onChange={setkey}>
      <TabBar.Item
        title='仓储'
        key='stock'
        icon={<Icon type='icon-renwu1' />}
      />
      <TabBar.Item
        title='任务'
        key='/Message'
        icon={<Icon type='icon-xiaoxi2' />}
      />
      <TabBar.Item
        className={style.scan}
        key='scan'
        icon={<Icon
          type='icon-dibudaohang-saoma'
        />}
      />
      <TabBar.Item
        title='报表'
        key='report'
        icon={<Icon type='icon-baobiao1' />}
      />
      <TabBar.Item
        title='动态'
        key='dynamic'
        icon={<Icon type='icon-wode' />}
      />
    </TabBar>
  </div>;
};

export default Stock;
