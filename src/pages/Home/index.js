import React from 'react';
import {  NoticeBar } from 'antd-mobile';
import Tark from './component/Tark';


const Home = () => {


  const data = new Date();

  const time = data.getFullYear() + '年' + (data.getMonth() + 1) + '月' + data.getDate();

  let xq = '';
  switch (data.getDay()) {
    case 0 :
      xq = '星期日';
      break;
    case 1:
      xq = '星期一';
      break;
    case 2:
      xq = '星期二';
      break;
    case 3:
      xq = '星期三';
      break;
    case 4:
      xq = '星期四';
      break;
    case 5:
      xq = '星期五';
      break;
    case 6:
      xq = '星期六';
      break;
    default:
      break;
  }

  return (
    <>

      <NoticeBar
        icon
        content={
          <div>
            <span style={{ fontSize: 24 }}>{time}</span>
            {xq}
          </div>
        } color='default' />


      <Tark />


      {/*<Tabs*/}
      {/*  className={style.tab}*/}
      {/*  style={{ backgroundColor: '#fff' }}*/}
      {/*>*/}
      {/*<TabPanel tabKey='0' tab='今日日程'>*/}
      {/*  <NoticeBar*/}
      {/*    icon*/}
      {/*    content={*/}
      {/*      <div>*/}
      {/*        <span style={{fontSize:24}}>{time}</span>*/}
      {/*        {xq}*/}
      {/*      </div>*/}
      {/*    } color='default' />*/}

      {/*  <Tark />*/}
      {/*</TabPanel>*/}

      {/*<TabPanel tabKey='1' tab='数据看板'>*/}
      {/*  <DataBoard />*/}
      {/*</TabPanel>*/}

      {/*<TabPanel tabKey='2' tab='待办事项'>*/}
      {/*  <div>*/}
      {/*    <List title={time}>*/}
      {/*      <ListItem thumb={<Icon type='icon-xuyue' style={{ color: '#9e3131', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待跟进任务*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-jiesuandanliebiao' style={{ color: '#18a05a', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待回款计划*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-dingdan' style={{ color: '#1d5da1', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待处理工单*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-rili' style={{ color: '#b49413', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待处理日程*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-wenjuan' style={{ color: '#281b9e', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待处理任务*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-dingdan1' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待审批订单*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-dakuanmingxi' style={{ color: '#24292e', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待审批回款*/}
      {/*      </ListItem>*/}
      {/*      <ListItem thumb={<Icon type='icon-dingdan' style={{ color: '#62227d', fontSize: '8vw' }} />}*/}
      {/*                extra={<div style={{ fontSize: 20 }} onClick={() => {*/}
      {/*                  router.push('/CompleteTrack');*/}
      {/*                }}>10 {<RightOutlined />}</div>}>*/}
      {/*        待审批报销*/}
      {/*      </ListItem>*/}
      {/*    </List>*/}
      {/*  </div>*/}
      {/*</TabPanel>*/}

      {/*<TabPanel tabKey='3' tab='工作动态'>*/}
      {/*  <div>*/}
      {/*    <Panel>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>狄仁杰</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>销售经理</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}

      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ fontSize: 14, marginTop: 10 }}> 为了更好地明天,大家一起努力.</div>*/}

      {/*      </PanelItem>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>武则天</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>总经理</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}
      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ marginTop: 10 }}> 成交订单:DD202121232266</div>*/}

      {/*      </PanelItem>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>李连贵</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>董事长</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}
      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ marginTop: 10 }}> 创建客户 xxx</div>*/}

      {/*      </PanelItem>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>孙二娘</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>营销组长</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}
      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ marginTop: 10 }}> 创建线索 xxx</div>*/}
      {/*      </PanelItem>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>王麻子</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>销售经理</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}
      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ marginTop: 10 }}> 创建商机 xxx</div>*/}
      {/*      </PanelItem>*/}
      {/*      <PanelItem*/}
      {/*        title={<div>*/}
      {/*          <div style={{ display: 'inline', fontSize: 16 }}>李二狗</div>*/}
      {/*          <div style={{ display: 'inline', marginLeft: 5 }}>销售经理</div>*/}
      {/*        </div>}*/}
      {/*        thumb={<Icon type='icon-jiaoseguanli' style={{ color: '#06ad56', fontSize: '8vw' }} />}*/}
      {/*        // text={true}*/}
      {/*        info={*/}
      {/*          <>*/}
      {/*            <div style={{ marginLeft: 5 }}><AimOutlined />*/}
      {/*              <span style={{ fontSize: 15, color: '#3982af' }}>上海市静安区中西路777弄55号</span>*/}
      {/*            </div>*/}
      {/*            <div style={{ marginTop: 10 }}>*/}
      {/*              <Brief style={{ marginLeft: 5 }}><ClockCircleOutlined /></Brief>*/}
      {/*              <Brief>2021-09-09 01:17 </Brief>*/}
      {/*              <Brief><HeartOutlined style={{ paddingLeft: 10 }} /><MessageOutlined*/}
      {/*                style={{ paddingLeft: 20 }} /><RightOutlined style={{ paddingLeft: 20 }} /></Brief>*/}
      {/*            </div>*/}
      {/*          </>*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <div style={{ marginTop: 10 }}> 创建联系人 xxx</div>*/}

      {/*      </PanelItem>*/}
      {/*    </Panel>*/}
      {/*  </div>*/}
      {/*</TabPanel>*/}


      {/*</Tabs>*/}
    </>
  );
};

export default Home;
