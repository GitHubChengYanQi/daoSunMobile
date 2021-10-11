import { Brief, Panel, PanelItem } from 'weui-react-v2';
import React from 'react';
import { Badge, Calendar } from 'antd';
import styles from '@/pages/Home/index.css';
import { ExclamationCircleOutlined, QqOutlined } from '@ant-design/icons';
import { Tabs } from 'antd-mobile';


const Schedule = () =>{

  function getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event。。....' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  const tabs = [
    { title: '我的日程'},
    { title: '下属日程'}
  ];

  return(
    <>
      <Tabs tabs={tabs}
            initialPage={0}
            onChange={(tab, index) => { console.log('onChange', index, tab); }}
            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      >
        <div >
          <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '45%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '45%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '45%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '45%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
        </div>
        <div >
          <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '10%', fontSize: 18}}><QqOutlined /> 李明</Brief>
                  <Brief style={{marginLeft: '10%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '10%', fontSize: 18}}><QqOutlined /> 李明</Brief>
                  <Brief style={{marginLeft: '10%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '10%', fontSize: 18}}><QqOutlined /> 李明</Brief>
                  <Brief style={{marginLeft: '10%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
          <Panel className={styles.panel}>
            <PanelItem
              text={true}
              info={
                <>
                  <Brief >与客户沟通报价事宜</Brief>
                  <Brief style={{marginLeft: '10%', fontSize: 18}}><QqOutlined /> 李明</Brief>
                  <Brief style={{marginLeft: '10%'}}><ExclamationCircleOutlined style={{color: 'green'}} /> 未完成</Brief>
                </>
              }
            >
              <div className={styles.comment} >11：00~12：00</div>
            </PanelItem>
          </Panel>
        </div>
      </Tabs>

  </>);
};
export default Schedule;
