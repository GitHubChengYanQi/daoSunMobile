import React from 'react';
import { TabBar } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../util/ToolUtil';


const MyTablBar = (
  {
    className,
    onChange = () => {
    },
    activeKey,
    tabBarItems = [],
  },
) => {

  return <TabBar
    className={ToolUtil.classNames(style.tabBarItem,className)}
    safeArea
    activeKey={activeKey}
    onChange={onChange}>
    {
      tabBarItems.map((item) => {
        return <TabBar.Item {...item} />;
      })
    }
  </TabBar>;
};

export default MyTablBar;
