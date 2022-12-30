import Home from './Home';
import { Badge, TabBar } from 'antd-mobile';
import Icon, { ScanIcon } from './components/Icon';
import React, { useState } from 'react';
import { connect } from 'dva';
import style from './index.less';
import MyEmpty from './components/MyEmpty';
import { ToolUtil } from '../util/ToolUtil';
import Report from './Report';
import Message from './Message';
import Notice from './Notice';
import User from './User';
import { useRequest } from '../util/Request';

const iconSize = 20;
export const messageCount = { url: '/message/getViewCount', method: 'GET' };

const Index = (props) => {

  const currentTab = localStorage.getItem('currentTab');

  const [module, setModule] = useState(currentTab || '/Home');

  const { data: messageTotal } = useRequest(messageCount, {
    pollingInterval: 30000,
  });
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
        return <Home setModule={setModule} />;
      case '/Report':
        return <Report />;
      case '/Message':
        return <Message />;
      case '/Notice':
        return <Notice />;
      case '/User':
        return <User />;
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
          localStorage.setItem('currentTab',value);
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
          icon={<Badge
            content={typeof messageTotal === 'number' && ((messageTotal > 99 ? '99+' : messageTotal) || null)}>
            <Icon style={{ fontSize: iconSize }} type='icon-xiaoxi2' />
          </Badge>}
        />
        <TabBar.Item
          title={(module === '/Home' && ToolUtil.isQiyeWeixin()) ? '扫码' : '首页'}
          key='/Home'
          icon={(module === '/Home' && ToolUtil.isQiyeWeixin())
            ?
            <ScanIcon
              style={{ fontSize: iconSize }}
              onClick={() => {
                props.dispatch({
                  type: 'qrCode/wxCpScan',
                });
              }}
            /> : <Icon type='icon-shouye3' style={{ fontSize: iconSize }} />}
        />
        <TabBar.Item
          title='数据'
          key='/Report'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-baobiao1' />}
        />
        <TabBar.Item
          title='我的'
          key='/User'
          icon={<Icon style={{ fontSize: iconSize }} type='icon-wode' />}
        />
      </TabBar>
    </div>
  );
};

export default connect(({ qrCode }) => ({ qrCode }))(Index);
