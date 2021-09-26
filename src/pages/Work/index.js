import React from 'react';
import { Flex, FlexItem, Grid, GridItem, List, ListItem, Panel, SafeArea, WhiteSpace, WingBlank } from 'weui-react-v2';
import {
  AlertOutlined,
  AppstoreOutlined, LaptopOutlined,
  PhoneOutlined,
  ShakeOutlined,
  TeamOutlined, ToolOutlined, UnorderedListOutlined,
  WechatOutlined, WhatsAppOutlined,
} from '@ant-design/icons';
import { Affix, Button } from 'antd';
import styles from './index.css';
import { router } from 'umi';
import { Badge } from 'antd-mobile';

const Work = () => {

  return (
      <WingBlank>
        <Affix offsetTop={0}>
          <List>
            <ListItem extra={<div>开发部</div>}>
              <div>下午好，程彦祺</div>
            </ListItem>
          </List>
        </Affix>
        <List title={<div>常用工具</div>}>
          <Grid>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>全局查找</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>扫一扫</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>拜访签到</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>日程管理</div>
            </GridItem>
          </Grid>
        </List>

      <List title={<div>项目管理</div>}>
        <Grid>
          <GridItem icon={<LaptopOutlined />}
          onClick={()=>{
            router.push('/Work/Business');
          }}>
            <div className={styles.size}>项目列表</div>
          </GridItem>
        </Grid>
      </List>

      <List className={styles.title} title={<div>客户管理</div>}>
        <Grid>
          <GridItem
            icon={<Badge text={77} size={'small'} overflowCount={55}><TeamOutlined style={{marginBottom:8}} /> </Badge>}
            onClick={() => {
              router.push('/Work/Customer');
            }}
          >
            <div className={styles.size}>客户列表</div>
          </GridItem>
          <GridItem
            icon={<Badge text={5}><AlertOutlined style={{marginBottom:8}} /></Badge>}
          >
            <div className={styles.size}>公海获客</div>
          </GridItem>
          <GridItem
            icon={<Badge text={0}><PhoneOutlined style={{marginBottom:8}} /></Badge>}
            onClick={() => {
              router.push('/Work/Customer?contacts');
            }}>
            <div className={styles.size}>联系人</div>
          </GridItem>
          <GridItem icon={<Badge text={110} size='small' overflowCount={99}>
            <ShakeOutlined style={{marginBottom:8}} />
          </Badge>}>
            <div className={styles.size}>附近客户</div>
          </GridItem>
          <GridItem icon={<ToolOutlined />}>
            <div className={styles.size}>自助服务门户</div>
          </GridItem>
        </Grid>
      </List>

        <List title={<div>售后服务</div>}>
          <Grid>
            <GridItem icon={<UnorderedListOutlined />} onClick={()=>{router.push('/Repair');}}>
              <div className={styles.size}>工单列表</div>
            </GridItem>
          </Grid>
        </List>

      <List className={styles.title} title={<div>销售管理</div>}>
        <Grid>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>微信</div>
          </GridItem>
        </Grid>
      </List>
    </WingBlank>
  );
};

export default Work;
