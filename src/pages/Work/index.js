import React from 'react';
import { Flex, FlexItem, Grid, GridItem, List, ListItem, Panel, SafeArea, WhiteSpace, WingBlank } from 'weui-react-v2';
import { AppstoreOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Badge, Button } from 'antd';
import styles from './index.css';

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
        <Panel className={styles.title} title={<div>常用工具</div>}>
          <Grid>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>商城管理</div>}>
          <Grid>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem  icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
            <GridItem icon={<AppstoreOutlined />}>
              <div className={styles.size}>工具</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>客户管理</div>}>
          <Grid>
            <GridItem
              icon={<Badge count={3}><WechatOutlined style={{ color: '#06ad56' }} /> </Badge>}
            >
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem
              icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem
                      icon={<Badge count={5}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem
                      icon={<Badge count={0}><WechatOutlined style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<Badge overflowCount={99} count={110}>
              <WechatOutlined
              style={{ color: '#06ad56' }} /></Badge>}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
          </Grid>
        </Panel>

        <Panel className={styles.title} title={<div>销售管理</div>}>
          <Grid>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
            <GridItem  icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
              <div className={styles.size}>微信</div>
            </GridItem>
          </Grid>
        </Panel>
      </WingBlank>
  );
};

export default Work;
