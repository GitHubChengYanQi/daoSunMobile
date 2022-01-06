import React from 'react';
import {
  ListItem,
} from 'weui-react-v2';

import { Affix } from 'antd';
import { history } from 'umi';
import {  Card, Grid, Space, Toast } from 'antd-mobile';
import Icon from '../components/Icon';
import { AuditOutlined, } from '@ant-design/icons';
import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';

const Work = () => {

  const { data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' });

  const toast = () => {
    return Toast.show({
      content: '暂未开通',
      position: 'bottom',
    });
  };

  const GridContent = (icon, title, routers) => {
    return <Grid.Item style={{width:'20vw',textAlign:'center'}} onClick={() => {
      typeof routers === 'string' ? history.push(routers) : routers();
    }}>
      <Space direction='vertical' justify='center' align='center'>
        {typeof icon === 'string' ? <Icon type={icon} style={{ fontSize: 24 }} /> : icon}
        {title}
      </Space>
    </Grid.Item>;
  };

  const GridStyle = (chirlen) => {
    return <Grid columns={4} style={{ '--gap-vertical': '16px' }}>
      {chirlen}
    </Grid>
  }

  return (
    <div style={{marginBottom:'10vh'}}>
      <Affix offsetTop={0}>
        <ListItem extra={<div>开发部</div>}>
          <div>下午好，{user && user.name}</div>
        </ListItem>
      </Affix>
      <Card title='常用工具'>
        {GridStyle(
          <>
            {GridContent('icon-sousuo', '全局查找', '/SearchButton')}
            {GridContent(<AuditOutlined style={{ fontSize: 24 }} />, '审批', '/Work/ProcessTask')}
            {GridContent('icon-saoyisao1', '扫一扫', ()=>{

            })}
            {GridContent('icon-riqian', '拜访签到', () => {
              toast();
            })}
            {GridContent('icon-rili', '日程管理', '/Schedule')}
          </>
        )}
      </Card>


      <Card title='项目管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-dingdan1', '项目列表', '/Work/Business')}
              {GridContent('icon-xiaojuchang', '项目流程', ()=>{
                toast();
              })}
              {GridContent('icon-dingdan1', '竞争对手', '/Work/Competitor')}
              {GridContent('icon-dingdan1', '报价管理', '/Work/Quote')}
              {GridContent('icon-dingdan1', '项目列表', '/Work/Business')}
            </>
          )
        }
      </Card>

      <Card title='客户管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '客户列表', '/Work/Customer')}
              {GridContent('icon-shequ', '公海获客', '/Work/Customer')}
              {GridContent('icon-yuangongliebiao', '联系人', '/Work/Customer?contacts')}
              {GridContent('icon-jiaoseguanli', '角色管理', ()=>{
                toast();
              })}
            </>
          )
        }
      </Card>

      <Card title='合同管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '合同列表', '/Work/Contract')}
              {GridContent('icon-zulinhetongmoban', '合同模板', ()=> toast())}
            </>
          )
        }

      </Card>

      <Card title='发货申请管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-fahuoshenqing', '发货申请列表', '/Work/OutstockApply')}
            </>
          )
        }

      </Card>

      <Card title='售后管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-gongdanliebiao', '工单管理', '/Repair')}
              {GridContent('icon-baoxiu', '创建报修', '/CreateRepair')}
            </>
          )
        }

      </Card>

      <Card title='仓储管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '库存管理', ()=>toast())}
              {GridContent('icon-shuju', '仓库管理', '/Work/StoreHouse')}
              {GridContent('icon-shuju', '入库管理', ()=>toast())}
              {GridContent('icon-shuju', '自由入库', '/Scan/InStock/FreeInstock')}
              {GridContent('icon-shuju', '出库管理', ()=>toast())}
              {GridContent('icon-shuju', '自由出库', '/Scan/OutStock/FreeOutstock')}
              {GridContent('icon-shuju', '盘点', '/Scan/Inventory')}
            </>
          )
        }
      </Card>

      <Card title='生产管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '质检任务管理', ()=>toast())}
            </>
          )
        }
      </Card>


      <Card title='产品资料管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '产品资料管理', '/Work/DataManage')}
            </>
          )
        }

      </Card>
      <Card title='操作'>
        {
          GridStyle(
            <>
              {GridContent('icon-shuju', '退出登陆', ()=>{
                cookie.remove('cheng-token');
                history.push('/Login')
              })}
            </>
          )
        }
      </Card>
    </div>
  )
    ;
};

export default Work;
