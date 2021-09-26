import styles from './index.css';
import React, { useEffect, useState } from 'react';
import {
  Brief, Button, List,
  ListItem, Panel, PanelItem, Search,
  WingBlank,
} from 'weui-react-v2';
import {
  SearchOutlined,
  ScanOutlined,
  DownOutlined,
  UpOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  GithubOutlined,
  WechatOutlined,
  RightOutlined,
  MessageOutlined, HeartOutlined, AimOutlined, LeftOutlined,
} from '@ant-design/icons';
import { Affix, Badge, Calendar, Card, Col, Divider, Menu, Row, Select, Switch, Tabs } from 'antd';
import DataBoard from '@/pages/Home/component/DataBoard';
import { router } from 'umi';
import { NavBar, Icon } from 'antd-mobile';
import CompleteTtem from '@/pages/Home/component/CompleteTtem';
const { TabPane } = Tabs;
const { Option } = Select;

const Home = () =>{

 const [state, setState] = useState(true)
  const [state1, setState1] = useState(true)
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const data = new Date();

  const time = data.getFullYear()+ "年" + (data.getMonth() + 1) + "月" + data.getDate();

  let xq = "";
  switch (data.getDay()) {
    case 0 :
      xq = "星期日";
      break;
    case 1:
      xq = "星期一";
      break;
    case 2:
      xq = "星期二";
      break;
    case 3:
      xq = "星期三";
      break;
    case 4:
      xq = "星期四";
      break;
    case 5:
      xq = "星期五";
      break;
    case 6:
      xq = "星期六";
      break;
  }
  return (
    <>
      <Affix offsetTop={0}>
        <NavBar
          mode='light'
        >首页</NavBar>
      </Affix>
      <WingBlank size="sm" >
        <Tabs >
          <TabPane key="a" tab="今日日程">
            <ListItem style={{padding: 3, backgroundColor: '#096DD9'}} extra={
              <Button style={{backgroundColor: '#096DD9', borderColor: 'white', color: 'white'}} onClick={()=>{router.push();}}>更多</Button>
            } >
              <div>
                <div style={{display: 'inline', fontSize: 28, color: 'white'}}>{time}</div>
                <div style={{display: 'inline', color: 'white'}}>{xq}</div>
              </div>
            </ListItem>

            {/*<Calendar />*/}
            <ListItem style={{padding: 3, backgroundColor: '#E6E6E6'}} extra={
              <Select defaultValue="1" style={{ backgroundColor: '#E6E6E6'}} onChange={handleChange}>
                <Option value="1">本日</Option>
                <Option value="2">本月</Option>
                <Option value="3">本年</Option>
              </Select>
            } >工作事项</ListItem>

            <Divider style={{margin: 15}}/>
            <div >
              <Row>
                <Col span={6} style={{textAlign: 'center'}}>
                  <Badge count={99} overflowCount={10}>
                    <div style={{fontSize: 40, color: "rgba(82,72,72,0.82)"}}>15</div><div style={{fontSize: 15}} >待执行</div>
                  </Badge>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <Badge count={99} overflowCount={10}>
                    <div style={{fontSize: 40, color: "rgba(15,99,109,0.82)"}}>15</div><div style={{fontSize: 15}}>进行中</div>
                  </Badge>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <Badge count={99} overflowCount={10}>
                    <div style={{fontSize: 40, color: 'blue'}}>15</div><div style={{fontSize: 15}}>已完成</div>
                  </Badge>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <Badge count={99} overflowCount={10}>
                    <div style={{fontSize: 40, color: 'red'}}>15</div><div style={{fontSize: 15}}>已超时</div>
                  </Badge>
                </Col>
              </Row>
            </div>
            <ListItem style={{marginTop: 8, padding: 3, backgroundColor: '#E6E6E6'}} extra={
              state ? <UpOutlined onClick={()=>{setState(!state)}}/> :
                <DownOutlined onClick={()=>{setState(!state)}}/>
            } >今日待办(10)</ListItem>
            {state ?
              <div >
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>李连杰</div><div style={{marginLeft: '70%',display: 'inline', color: 'red'}}><ExclamationCircleOutlined style={{color: 'red'}} />  已超时</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'red'}}>5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round" size='small'>工作任务</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >跟张总去税务局取发票</div>
                  </PanelItem>
                </Panel >
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>战全胜</div><div style={{marginLeft: '70%',display: 'inline', color: 'green'}}><ExclamationCircleOutlined style={{color: 'green'}} />  进行中</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'green'}}>5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round"  size='small'>客户跟进</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >跟张总去税务局取发票</div>
                  </PanelItem>
                </Panel>
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>李连杰</div><div style={{marginLeft: '70%',display: 'inline'}}><ExclamationCircleOutlined/>  待执行</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief >5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round"  size='small'>工作任务</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >与客户沟通报价事宜</div>
                  </PanelItem>
                </Panel>
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>李连杰</div><div style={{marginLeft: '70%',display: 'inline'}}><ExclamationCircleOutlined />  已取消</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'blue'}}>5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round"  size='small'>回款计划</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >计划回款金额</div>
                  </PanelItem>
                </Panel>
              </div> : null}
            <ListItem style={{marginTop: 8, padding: 3, backgroundColor: '#E6E6E6'}} extra={
              state1 ? <UpOutlined onClick={()=>{setState1(!state1)}}/> :
                <DownOutlined onClick={()=>{setState1(!state1)}}/>
            } >今日完成(10)</ListItem>
            {state1 ?
              <div >
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>李连杰</div><div style={{marginLeft: '70%',display: 'inline', color: 'blue'}}><ExclamationCircleOutlined style={{color: 'blue'}} />  已完成</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'blue'}}>5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round" size='small'>合同回款</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >Z3050*16/1，1台，VMC850E，1台</div>
                  </PanelItem>
                </Panel>
                <Panel className={styles.panel}>
                  <PanelItem
                    title={<div ><div className={styles.panelTitle}>战全胜</div><div style={{marginLeft: '70%',display: 'inline', color: 'green'}}><ExclamationCircleOutlined style={{color: 'green'}} />  未完成</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'green'}}>5小时</Brief>
                        <Brief style={{marginLeft: '12%'}}><Button shape="round" size='small'>需求商机</Button></Brief>
                      </>
                    }
                  >
                    <div className={styles.comment} >回款金额：¥25000.00</div>
                  </PanelItem>
                </Panel>
              </div> : null}
          </TabPane>
          <TabPane key="b" tab="数据看板">
            <DataBoard />
          </TabPane>
          <TabPane key="c" tab="待办事项">
            <div >
              <List title="2021-03-01">
                <ListItem thumb={<GithubOutlined style={{ color: '#24292e', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待跟进任务
                </ListItem>
                <ListItem thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待回款计划
                </ListItem>
                <ListItem thumb={<GithubOutlined style={{ color: '#24292e', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待处理工单
                </ListItem>
                <ListItem thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待处理日程
                </ListItem>
                <ListItem thumb={<GithubOutlined style={{ color: '#24292e', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待处理任务
                </ListItem>
                <ListItem thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待审批订单
                </ListItem>
                <ListItem thumb={<GithubOutlined style={{ color: '#24292e', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待审批回款
                </ListItem>
                <ListItem thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}>10 {<RightOutlined />}</div>}>
                  待审批报销
                </ListItem>
              </List>
            </div>
          </TabPane>
          <TabPane key="d" tab="工作动态">
            <div>
              <Panel >
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>销售经理</div></div>}
                  thumb={<GithubOutlined style={{ color: '#24292e', fontSize: '8vw' }} />}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{fontSize: 14, marginTop: 10}} > 为了更好地明天,大家一起努力.</div>

                </PanelItem>
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>总经理</div></div>}
                  thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{ marginTop: 10}} > 成交订单:DD202121232266</div>

                </PanelItem>
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>董事长</div></div>}
                  thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{ marginTop: 10}} > 创建客户  xxx</div>

                </PanelItem>
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>营销组长</div></div>}
                  thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{ marginTop: 10}} > 创建线索 xxx</div>
                </PanelItem>
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>销售经理</div></div>}
                  thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{ marginTop: 10}} > 创建商机 xxx</div>
                </PanelItem>
                <PanelItem
                  title={<div><div style={{display: 'inline', fontSize: 16}}>狄仁杰</div><div style={{display: 'inline', marginLeft: 5}}>销售经理</div></div>}
                  thumb={<WechatOutlined style={{ color: '#06ad56', fontSize: '8vw' }}/>}
                  // text={true}
                  info={
                    <>
                      <div style={{marginLeft: 5}}><AimOutlined />
                        <span style={{fontSize: 15, color:'#3982af'}}>上海市静安区中西路777弄55号</span>
                      </div>
                      <div style={{marginTop: 10}}>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief ><HeartOutlined style={{paddingLeft: 10}}/><MessageOutlined style={{paddingLeft: 20}}/><RightOutlined style={{paddingLeft: 20}}/></Brief>
                      </div>
                    </>
                  }
                >
                  <div style={{ marginTop: 10}} > 创建联系人 xxx</div>

                </PanelItem>
              </Panel>
            </div>
          </TabPane>
          <TabPane key="e" disabled tab={
            <div>
              <Button type='link' size='large' style={{padding: 0}} onClick={()=>{router.push('/SearchButton');}} icon={<SearchOutlined />} />
              <Button type='link' size='large' style={{padding: 0}} icon={<ScanOutlined />} />
            </div>}
          />
        </Tabs>

        {/*<Affix offsetTop={0}>*/}
        {/*  <Search*/}
        {/*    style={{paddingRight: '30%',float: 'left'}}*/}
        {/*    placeholder="全局搜索关键字"*/}
        {/*    onConfirm={(val) => console.log('确认输入: ', val)}*/}
        {/*    onSearch={(val) => console.log('search: ', val)}*/}
        {/*    onCancel={() => console.log('取消搜索')}*/}
        {/*  >*/}
        {/*  </Search>*/}
        {/*</Affix>*/}
      </WingBlank>
  </>
  );
};

export default Home;
