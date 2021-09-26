import React from 'react';
import {
  Flex,
  FlexItem,
  Grid,
  GridItem,
  List,
  ListItem,
  Panel,
  SafeArea,
  Toast,
  WhiteSpace,
  WingBlank,
} from 'weui-react-v2';
import {
  AlertOutlined,
  AppstoreOutlined,
  LaptopOutlined,
  PhoneOutlined,
  ShakeOutlined,
  TeamOutlined,
  ToolOutlined,
  FileSearchOutlined,
  WechatOutlined,
  RobotOutlined,
  SoundOutlined,
  BranchesOutlined,
  MehOutlined,
  PropertySafetyOutlined,
  LeftOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { Affix, Button } from 'antd';
import styles from './index.css';
import { router } from 'umi';
import { Badge, NavBar } from 'antd-mobile';

const Work = () => {

  const toast = () => {
    Toast.text('暂未开通');
  };

  return (
    <>
      <Affix offsetTop={0}>
        <NavBar
          mode='light'
        >工作</NavBar>
        <ListItem extra={<div>开发部</div>}>
          <div>下午好，程彦祺</div>
        </ListItem>
      </Affix>
      <List title={<div>常用工具</div>}>
        <Grid>
          <GridItem icon={<AppstoreOutlined />} onClick={()=>{router.push('/SearchButton');}}>
            <div className={styles.size}>全局查找</div>
          </GridItem>
          <GridItem icon={<AppstoreOutlined />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>扫一扫</div>
          </GridItem>
          <GridItem icon={<AppstoreOutlined />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>拜访签到</div>
          </GridItem>
          <GridItem icon={<AppstoreOutlined />} onClick={()=>{router.push('/Schedule');}}>
            <div className={styles.size}>日程管理</div>
          </GridItem>
          <GridItem icon={<AppstoreOutlined />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>话术</div>
          </GridItem>
          <GridItem icon={<AppstoreOutlined />} onClick={() => {
            toast();
          }}>
            <div className={styles.size}>产品资料</div>
          </GridItem>
        </Grid>
      </List>

      <List title={<div>项目管理</div>}>
        <Grid>
          <GridItem icon={<LaptopOutlined />}
                    onClick={() => {
                      router.push('/Work/Business');
                    }}>
            <div className={styles.size}>项目列表</div>
          </GridItem>
          <GridItem icon={<SoundOutlined />}
                    onClick={() => {
                      toast();
                    }}>
            <div className={styles.size}>项目来源</div>
          </GridItem>
          <GridItem icon={<BranchesOutlined />}
                    onClick={() => {
                      toast();
                    }}>
            <div className={styles.size}>项目流程</div>
          </GridItem>
          <GridItem icon={<MehOutlined />}
                    onClick={() => {
                      router.push('/Work/Competitor');
                    }}>
            <div className={styles.size}>竞争对手</div>
          </GridItem>
          <GridItem icon={<PropertySafetyOutlined />}
                    onClick={() => {
                      toast();
                    }}>
            <div className={styles.size}>对手报价</div>
          </GridItem>
        </Grid>
      </List>

      <List className={styles.title} title={<div>客户管理</div>}>
        <Grid>
          <GridItem
            icon={<Badge text={77} size={'small'} overflowCount={55}><TeamOutlined style={{ marginBottom: 8 }} />
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
            icon={<Badge text={5}><AlertOutlined style={{ marginBottom: 8 }} /></Badge>}
          >
            <div className={styles.size}>公海获客</div>
          </GridItem>
          <GridItem
            icon={<Badge text={0}><PhoneOutlined style={{ marginBottom: 8 }} /></Badge>}
            onClick={() => {
              router.push('/Work/Customer?contacts');
            }}>
            <div className={styles.size}>联系人</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<Badge text={110} size='small' overflowCount={99}>
            <ShakeOutlined style={{ marginBottom: 8 }} />
          </Badge>}>
            <div className={styles.size}>附近客户</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>客户级别</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>角色管理</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<ToolOutlined />}>
            <div className={styles.size}>自助服务门户</div>
          </GridItem>
        </Grid>
      </List>

      <List className={styles.title} title={<div>合同管理</div>}>
        <Grid>
          <GridItem icon={<FileDoneOutlined />} onClick={() => {
            router.push('/Work/Contract');
          }}>
            <div className={styles.size}>合同列表</div>
          </GridItem>
          <GridItem onClick={() => {
            toast();
          }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>合同模板</div>
          </GridItem>
        </Grid>
      </List>
      <List className={styles.title} title={<div>发货申请管理</div>}>
        <Grid>
          <GridItem onClick={() => {
            toast();
          }} icon={<WechatOutlined style={{ color: '#06ad56' }} />}>
            <div className={styles.size}>发货申请列表</div>
          </GridItem>
        </Grid>
      </List>
      <List className={styles.title} title={<div>售后管理</div>}>
        <Grid>
          <GridItem icon={<FileSearchOutlined style={{ color: '#06ad56' }} onClick={() => {
            router.push('/Repair');
          }} />}>
            <div className={styles.size}>工单管理</div>
          </GridItem>
          <GridItem icon={<RobotOutlined style={{ color: '#06ad56' }} onClick={() => {
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
