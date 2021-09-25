import React from 'react';
import { Flex, FlexItem, Grid, GridItem, List, ListItem, Panel, SafeArea, WhiteSpace, WingBlank } from 'weui-react-v2';
import { AppstoreOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Badge, Button } from 'antd';
import styles from './index.css';
import { router } from 'umi';

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
            <GridItem icon={<AppstoreOutlined />} onClick={()=>{router.push('/Repair');}}>
              <div className={styles.size}>工单列表</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
          </Grid>
        </List>

      <List title={<div>项目管理</div>}>
        <Grid>
          <GridItem icon={<AppstoreOutlined />}
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
            icon={<Badge count={3}><WechatOutlined style={{ color: '#06ad56', fontSize: 28 }} /> </Badge>}
            onClick={() => {
              router.push('/Work/Customer');
            }}
          >
            <div className={styles.size}>终端用户</div>
          </GridItem>
          <GridItem
            icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56', fontSize: 28 }} /></Badge>}
            onClick={() => {
              router.push('/Work/Customer');
            }}>
            <div className={styles.size}
            >渠道客户
            </div>
          </GridItem>
          <GridItem
            icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56', fontSize: 28 }} /></Badge>}
          >
            <div className={styles.size}>公海获客</div>
          </GridItem>
          <GridItem
            icon={<Badge count={0}><WechatOutlined style={{ color: '#06ad56', fontSize: 28 }} /></Badge>}
            onClick={() => {
              router.push('/Work/Customer?contacts');
            }}>
            <div className={styles.size}>联系人</div>
          </GridItem>
          <GridItem icon={<Badge overflowCount={99} count={110}>
            <WechatOutlined
              style={{ color: '#06ad56', fontSize: 28 }} /></Badge>}>
            <div className={styles.size}>附近客户</div>
          </GridItem>
          <GridItem icon={<WechatOutlined style={{ color: '#06ad56', fontSize: 28 }} />}>
            <div className={styles.size}>自助服务门户</div>
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
