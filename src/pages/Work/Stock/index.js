import React, { useRef, useState } from 'react';
import { TabBar } from 'antd-mobile';
import Icon from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import StockDetail from './components/StockDetail';
import MyNavBar from '../../components/MyNavBar';
import { ToolUtil } from '../../components/ToolUtil';
import { useScroll } from 'ahooks';

const Stock = () => {

  const [key, setkey] = useState('stock');

  const content = () => {
    switch (key) {
      case 'stock':
        return <StockDetail />;
      default:
        return <MyEmpty height='100%' />;
    }
  };


  return <div className={style.pageIndex}>
    <MyNavBar title='库存管理' />
    <div
      className={style.content}
      style={{ height: ToolUtil.isQiyeWeixin() ? 'calc(100% - 70px)' : 'calc(100% - 70px - 45px)' }}
    >
      {content()}
    </div>
    <TabBar
      className={style.tabBarItem}
      safeArea
      activeKey={key}
      onChange={(key) => {
        if (key !== 'scan') {
          setkey(key);
        }
      }}>
      <TabBar.Item
        title='仓储'
        key='stock'
        icon={<Icon type='icon-cangchu' />}
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
        icon={<Icon type='icon-dongtai' />}
      />
    </TabBar>
  </div>;
};

export default Stock;
