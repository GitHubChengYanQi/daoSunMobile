import React from 'react';
import { Flex, FlexItem, Grid, GridItem, List, ListItem, Panel, SafeArea, WingBlank } from 'weui-react-v2';
import { AppstoreOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Badge, Button } from 'antd';
import styles from './index.css';

const Work = () => {

  return (
    <SafeArea style={{ margin: '-0.16rem', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>
      <WingBlank size='sm'>
        <Affix offsetTop={-20}>
          <List>
            <ListItem style={{ padding: 8, fontSize: 54 }} extra={<div>开发部</div>}>
              <div>下午好，程彦祺</div>
            </ListItem>
          </List>
        </Affix>
        <Panel className={styles.title} title={<div>常用工具</div>}>
          <Grid>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>商城管理</div>}>
          <Grid>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>客户管理</div>}>
          <Grid>
            <GridItem
              style={{ padding: 0 }}
              icon={<Badge count={3}><WechatOutlined style={{ color: '#06ad56' }} /> </Badge>}
            >
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem
              style={{ padding: 0 }}
              icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }}
                      icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }}
                      icon={<Badge count={0}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<Badge overflowCount={99} count={110}><WechatOutlined
              style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>销售管理</div>}>
          <Grid>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem style={{ padding: 0 }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
          </Grid>
        </Panel>
      </WingBlank>
    </SafeArea>
  );
};

export default Work;
