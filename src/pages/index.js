import Home from './Home';
import { TabBar } from 'antd-mobile';
import Icon from './components/Icon';
import React, { useState } from 'react';
import { connect } from 'dva';
import style from './index.less';
import MyEmpty from './components/MyEmpty';
import { ToolUtil } from './components/ToolUtil';

const iconSize = 20;

const Index = (props) => {

  const routes = props.qrCode && props.qrCode.route;

  const [module, setModule] = useState(routes || '/Home');

  const route = (name) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload: {
        route: name,
      },
    });
  };

  const content = () => {
    switch (module) {
      case '/Home':
        return <Home {...props} />;
      default:
        return <MyEmpty height='100%' />;
    }
  };

  return (
    <div className={style.pageIndex}>
      <div className={style.content}>
        {content()}
      </div>
      <TabBar
        className={style.tabBarItem}
        safeArea
        activeKey={module}
        onChange={(value) => {
          if (module === '/Home' && value === '/Home' && ToolUtil.isQiyeWeixin()) {
            props.dispatch({
              type: 'qrCode/wxCpScan',
            });
          }
          route(value);
          setModule(value);
        }}>
        <TabBar.Item
          title='任务'
          key='/Notice'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-renwu1' />}
        />
        <TabBar.Item
          title='消息'
          key='/Message'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-xiaoxi2' />}
        />
        <TabBar.Item
          title={(module === '/Home' && ToolUtil.isQiyeWeixin()) ? '扫码' : '首页'}
          key='/Home'
          icon={<Icon
            style={{ fontSize: iconSize }}
            type={(module === '/Home' && ToolUtil.isQiyeWeixin()) ? 'icon-dibudaohang-saoma' : 'icon-shouye3'}
          />}
        />
        <TabBar.Item
          title='报表'
          key='/Work'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-baobiao1' />}
        />
        <TabBar.Item
          title='我的'
          key='/Report'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-wode' />}
        />
      </TabBar>
    </div>
  );
};

export default connect(({ qrCode }) => ({ qrCode }))(Index);
