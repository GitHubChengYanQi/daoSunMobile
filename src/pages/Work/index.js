import React from 'react';
import {

  Grid,
  GridItem,
  List,
  ListItem,

  Toast,

} from 'weui-react-v2';

import { Affix } from 'antd';
import styles from './index.css';
import { router } from 'umi';
import { Badge } from 'antd-mobile';
import Icon from '../components/Icon';
import { UserDeleteOutlined } from '@ant-design/icons';

const Work = () => {

  const toast = () => {
    Toast.text('暂未开通');
  };

  return (
    <>
      <Affix offsetTop={0}>
        <ListItem extra={<div>开发部</div>}>
          <div>下午好，程彦祺</div>
        </ListItem>
      </Affix>
      <List title={<div>常用工具</div>}>
        <Grid>
          <GridItem icon={<Icon type='icon-sousuo' />} onClick={() => {
            router.push('/SearchButton');
          }}>
            <div className={styles.size}>全局查找</div>
          </GridItem>
          <GridItem icon={<Icon type='icon-saoyisao1' />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>扫一扫</div>
          </GridItem>
          <GridItem icon={<Icon type='icon-riqian' />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>拜访签到</div>
          </GridItem>
          <GridItem icon={<Icon type='icon-rili' />} onClick={() => {
            router.push('/Schedule');
          }}>
            <div className={styles.size}>日程管理</div>
          </GridItem>
        </Grid>
      </List>

      <List title={<div>项目管理</div>}>
        <Grid>
          <GridItem
            icon={<Icon type='icon-dingdan1' />}
            onClick={() => {
              router.push('/Work/Business');
            }}>
            <div className={styles.size}>项目列表</div>
          </GridItem>
          <GridItem
            icon={<Icon type='icon-xiaojuchang' />}
            onClick={() => {
              toast();
            }}>
            <div className={styles.size}>项目流程</div>
          </GridItem>
          <GridItem
            icon={<UserDeleteOutlined />}
            onClick={() => {
              router.push('/Work/Competitor');
            }}
          >
            <div className={styles.size}>竞争对手</div>
          </GridItem>
        </Grid>
      </List>

      <List className={styles.title} title={<div>客户管理</div>}>
        <Grid>
          <GridItem
            icon={<Badge content={77} size={'small'} overflowCount={55}>
              <Icon
                type='icon-shuju'
                style={{ fontSize: 32 }} />
            </Badge>}
            onClick={() => {
              router.push('/Work/Customer');
            }}
          >
            <div className={styles.size}>客户列表</div>
          </GridItem>
          <GridItem
            onClick={() => {
              router.push('/Work/Customer');
            }}
            icon={<Badge content={5}><Icon type='icon-shequ' style={{ fontSize: 32 }} /></Badge>}
          >
            <div className={styles.size}>公海获客</div>
          </GridItem>
          <GridItem
            icon={<Badge content={0}><Icon type='icon-yuangongliebiao' style={{ fontSize: 32 }} /></Badge>}
            onClick={() => {
              router.push('/Work/Customer?contacts');
            }}>
            <div className={styles.size}>联系人</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<Icon type='icon-jiaoseguanli' />}>
            <div className={styles.size}>角色管理</div>
          </GridItem>
        </Grid>
      </List>

      <List className={styles.title} title={<div>合同管理</div>}>
        <Grid>
          <GridItem icon={<Icon type='icon-shuju' />} onClick={() => {
            router.push('/Work/Contract');
          }}>
            <div className={styles.size}>合同列表</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<Icon type='icon-zulinhetongmoban' />}>
            <div className={styles.size}>合同模板</div>
          </GridItem>
        </Grid>
      </List>
      <List className={styles.title} title={<div>发货申请管理</div>}>
        <Grid>
          <GridItem onClick={() => {
            toast();
          }} icon={<Icon type='icon-fahuoshenqing' />}>
            <div className={styles.size}>发货申请列表</div>
          </GridItem>
        </Grid>
      </List>
      <List className={styles.title} title={<div>售后管理</div>}>
        <Grid>
          <GridItem icon={<Icon type='icon-gongdanliebiao' onClick={() => {
            router.push('/Repair');
          }} />}>
            <div className={styles.size}>工单管理</div>
          </GridItem>
          <GridItem icon={<Icon type='icon-baoxiu' onClick={() => {
            router.push('/CreateRepair');
          }} />}>
            <div className={styles.size}>创建报修</div>
          </GridItem>
        </Grid>
      </List>
    </>
  );
};

export default Work;
