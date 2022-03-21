import React from 'react';
import {
  ListItem,
} from 'weui-react-v2';
import { Affix } from 'antd';
import { history } from 'umi';
import { Card, Divider, Grid, Space, Toast } from 'antd-mobile';
import Icon from '../components/Icon';
import { useRequest } from '../../util/Request';
import cookie from 'js-cookie';
import moment from 'moment';
import { getHeader } from '../components/GetHeader';

const Work = () => {
  const hours = moment().hours();

  const { data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' });

  const date = () => {
    if (hours > 5 && hours < 8) {
      return {
        hours: '早安',
      };
    } else if (hours < 12) {
      return {
        hours: '上午好',
      };
    } else if (hours < 18) {
      return {
        hours: '下午好',
      };
    } else if (hours < 22) {
      return {
        hours: '晚上好',
      };
    } else {
      return {
        hours: '夜深了，早点休息，晚安~',
      };
    }
  };

  const toast = () => {
    return Toast.show({
      content: '暂未开通',
      position: 'bottom',
    });
  };

  const GridContent = (icon, title, routers) => {
    return <Grid.Item style={{ width: '20vw', textAlign: 'center' }} onClick={() => {
      typeof routers === 'string' ? history.push(routers) : routers();
    }}>
      <Space direction='vertical' justify='center' align='center'>
        {typeof icon === 'string' ? <Icon type={icon} style={{ fontSize: getHeader() ? 40 : 50 }} /> : icon}
        {title}
      </Space>
    </Grid.Item>;
  };

  const GridStyle = (chirlen) => {
    return <Grid columns={4} style={{ '--gap-vertical': '16px' }}>
      {chirlen}
    </Grid>;
  };

  return (
    <div>
      <Affix offsetTop={0}>
        <ListItem extra={<div>{user && user.deptName}</div>}>
          <div>{date().hours}，{user && user.name}</div>
        </ListItem>
      </Affix>
      <Card title='常用工具'>
        {GridStyle(
          <>
            {GridContent('icon-quanjusousuo1', '全局查找', '/SearchButton')}
            {GridContent('icon-shenpi1', '审批', '/Work/ProcessTask')}
            {GridContent('icon-saoyisao4', '扫一扫', () => {

            })}
            {GridContent('icon-baifangqiandao1', '拜访签到', () => {
              toast();
            })}
            {GridContent('icon-richengguanli1', '日程管理', '/Schedule')}
          </>,
        )}
      </Card>


      <Card title='项目管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-xiangmuliebiao1', '项目列表', '/Work/Business')}
              {GridContent('icon-xiangmuliucheng1', '项目流程', () => {
                toast();
              })}
              {GridContent('icon-jingzhengduishou1', '竞争对手', '/Work/Competitor')}
              {GridContent('icon-baojiaguanli1', '报价管理', '/Work/Quote')}
            </>,
          )
        }
      </Card>

      <Card title='客户管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-kehuliebiao1', '客户列表', '/Work/Customer')}
              {GridContent('icon-gonghaihuoke1', '公海获客', '/Work/Customer')}
              {GridContent('icon-lianxiren1', '联系人', '/Work/Customer?contacts')}
              {GridContent('icon-jiaoseguanli2', '角色管理', () => {
                toast();
              })}
            </>,
          )
        }
      </Card>

      <Card title='合同管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-hetongliebiao1', '合同列表', '/Work/Contract')}
              {GridContent('icon-hetongmoban1', '合同模板', () => toast())}
            </>,
          )
        }

      </Card>

      <Card title='生产管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-zhijianrenwuguanli', '生产工单', '/Work/Production')}
              {GridContent('icon-zhijianrenwuguanli', '质检任务管理', () => toast())}
            </>,
          )
        }
      </Card>



      <Card title='采购管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-cangkuguanli', '采购申请管理', '/Work/purchaseAsk')}
              {GridContent('icon-cangkuguanli', '采购单管理', '/Work/ProcurementOrder')}
            </>,
          )
        }
      </Card>

      <Card title='仓储管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-cangkuguanli', '仓库管理', '/Work/StoreHouse')}
              {GridContent('icon-rukuguanli1', '入库管理', () => toast())}
              {GridContent('icon-ziyouruku', '自由入库', '/Scan/InStock/FreeInstock')}
              {GridContent('icon-chukuguanli1', '出库管理', () => toast())}
              {GridContent('icon-ziyouchuku', '自由出库', '/Scan/OutStock/FreeOutstock')}
              {GridContent('icon-pandian', '盘点', '/Scan/Inventory')}
            </>,
          )
        }
      </Card>

      <Card title='发货申请管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-fahuoshenqingliebiao1', '发货申请列表', '/Work/OutstockApply')}
            </>,
          )
        }

      </Card>

      <Card title='售后管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-gongdanguanli1', '工单管理', '/Repair')}
              {GridContent('icon-chuangjianbaoxiu1', '创建报修', '/CreateRepair')}
            </>,
          )
        }

      </Card>


      <Card title='产品资料管理'>
        {
          GridStyle(
            <>
              {GridContent('icon-chanpinziliaoguanli', '产品资料管理', '/Work/DataManage')}
            </>,
          )
        }

      </Card>
      <Card title='操作'>
        {
          GridStyle(
            <>
              {GridContent('icon-a-tuichudenglu2', '退出登陆', () => {
                cookie.remove('cheng-token');
                history.push('/Login');
              })}
            </>,
          )
        }
      </Card>
      <Divider style={{ height: '10vh', backgroundColor: '#fff', margin: 0, padding: 0 }}>已经到底了！</Divider>
    </div>
  );
};

export default Work;
