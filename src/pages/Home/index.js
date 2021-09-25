import styles from './index.css';
import React, { useEffect, useState } from 'react';
import {
  Brief,
  ListItem, Panel, PanelItem,
  WingBlank,
} from 'weui-react-v2';
import {SearchOutlined, ScanOutlined, DownOutlined, UpOutlined, ClockCircleOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { Badge, Button, Calendar, Card, Col, Divider, Menu, Row, Select, Switch, Tabs } from 'antd';
import DataBoard from '@/pages/Home/component/DataBoard';
import DealRank from '@/pages/Home/component/DealRank';
import SaleFunnel from '@/pages/Home/component/SaleFunnel';

const { TabPane } = Tabs;
const { Option } = Select;

const Home = () =>{

 const [state, setState] = useState(true)
  const [state1, setState1] = useState(true)
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <WingBlank size="sm" >
        <Tabs >
          <TabPane key="a" tab={<span className="tab_point">今日日程</span>}>
            {/*<Calendar onPanelChange={onPanelChange} />*/}
            <ListItem style={{padding: 3, backgroundColor: '#E6E6E6'}} extra={
              <Select defaultValue="1" style={{ backgroundColor: '#E6E6E6'}} onChange={handleChange}>
                <Option value="1">本日</Option>
                <Option value="2">本月</Option>
                <Option value="3">本年</Option>
              </Select>
            } ><div style={{fontSize: 16}} >工作事项</div></ListItem>

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
            } ><div style={{fontSize: 16}} >今日待办(10)</div></ListItem>
            {state ?
            <div >
              <Panel >
                <PanelItem
                  title={<div ><div className={styles.title}>李连杰</div><div style={{marginLeft: '60%',display: 'inline', color: 'red'}}><ExclamationCircleOutlined style={{color: 'red'}} />  已超时</div></div>}
                  text={true}
                  info={
                    <>
                      <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                      <Brief >2021-09-09 01:17 </Brief>
                      <Brief style={{color: 'red'}}>5小时</Brief>
                      <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>工作任务</Button></Brief>
                    </>
                  }
                >
                  <div style={{marginLeft: 5, color: 'black'}}>跟张总去税务局取发票</div>
                </PanelItem>
              </Panel>
              <Panel >
                <PanelItem
                  title={<div ><div className={styles.title}>战全胜</div><div style={{marginLeft: '60%',display: 'inline', color: 'green'}}><ExclamationCircleOutlined style={{color: 'green'}} />  进行中</div></div>}
                  text={true}
                  info={
                    <>
                      <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                      <Brief >2021-09-09 01:17 </Brief>
                      <Brief style={{color: 'green'}}>5小时</Brief>
                      <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>客户跟进</Button></Brief>
                    </>
                  }
                >
                  <div style={{marginLeft: 5, color: 'black'}}>跟张总去税务局取发票</div>
                </PanelItem>
              </Panel>
              <Panel >
                <PanelItem
                  title={<div ><div className={styles.title}>李连杰</div><div style={{marginLeft: '60%',display: 'inline'}}><ExclamationCircleOutlined/>  待执行</div></div>}
                  text={true}
                  info={
                    <>
                      <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                      <Brief >2021-09-09 01:17 </Brief>
                      <Brief >5小时</Brief>
                      <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>回款计划</Button></Brief>
                    </>
                  }
                >
                  <div style={{marginLeft: 5, color: 'black'}}>与客户沟通报价事宜</div>
                </PanelItem>
              </Panel>
              <Panel >
                <PanelItem
                  title={<div ><div className={styles.title}>李连杰</div><div style={{marginLeft: '60%',display: 'inline'}}><ExclamationCircleOutlined />  已取消</div></div>}
                  text={true}
                  info={
                    <>
                      <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                      <Brief >2021-09-09 01:17 </Brief>
                      <Brief style={{color: 'blue'}}>5小时</Brief>
                      <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>工作任务</Button></Brief>
                    </>
                  }
                >
                  <div style={{marginLeft: 5, color: 'black'}}>计划回款金额</div>
                </PanelItem>
              </Panel>
          </div> : null}
            <ListItem style={{marginTop: 8, padding: 3, backgroundColor: '#E6E6E6'}} extra={
              state1 ? <UpOutlined onClick={()=>{setState1(!state1)}}/> :
                <DownOutlined onClick={()=>{setState1(!state1)}}/>
            } ><div style={{fontSize: 16}} >今日完成(10)</div></ListItem>
            {state1 ?
              <div >
                <Panel >
                  <PanelItem
                    title={<div ><div className={styles.title}>李连杰</div><div style={{marginLeft: '60%',display: 'inline', color: 'blue'}}><ExclamationCircleOutlined style={{color: 'blue'}} />  已完成</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'blue'}}>5小时</Brief>
                        <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>合同回款</Button></Brief>
                      </>
                    }
                  >
                    <div style={{marginLeft: 5, color: 'black'}}>Z3050*16/1，1台，VMC850E，1台</div>
                  </PanelItem>
                </Panel>
                <Panel >
                  <PanelItem
                    title={<div ><div className={styles.title}>战全胜</div><div style={{marginLeft: '60%',display: 'inline', color: 'green'}}><ExclamationCircleOutlined style={{color: 'green'}} />  未完成</div></div>}
                    text={true}
                    info={
                      <>
                        <Brief style={{marginLeft: 5}}><ClockCircleOutlined /></Brief>
                        <Brief >2021-09-09 01:17 </Brief>
                        <Brief style={{color: 'green'}}>5小时</Brief>
                        <Brief style={{marginLeft: '23%'}}><Button shape="round"  size='small'>需求商机</Button></Brief>
                      </>
                    }
                  >
                    <div style={{marginLeft: 5, color: 'black'}}>回款金额：¥25000.00</div>
                  </PanelItem>
                </Panel>
              </div> : null}
          </TabPane>
          <TabPane key="b" tab={<span className="tab_point">数据看板</span>}>
            <div>
              <DataBoard />
            </div>


          </TabPane>
          <TabPane key="c" tab={<span className="tab_point">待办事项</span>}>
            <div
              className="fimg"
              style={{
                height: '350px',
                // backgroundImage: `url(${require('../swiper/pexels-photo-296878.jpeg')})`,
              }}
            />
          </TabPane>
          <TabPane key="d" tab={<span className="tab_point">工作动态</span>}>
            <div
              className="fimg"
              style={{
                height: '350px',
                // backgroundImage: `url(${require('../swiper/pexels-photo-296878.jpeg')})`,
              }}
            />
          </TabPane>
          <TabPane key="e" tab={<span className="tab_point"><Button style={{backgroundColor: 'white', padding: 0}} icon={<SearchOutlined />} /></span>}>
          </TabPane>
          <TabPane key="f" tab={<span className="tab_point"><Button style={{backgroundColor: 'white', padding: 0}} icon={<ScanOutlined />} /></span>}>
          </TabPane>

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
