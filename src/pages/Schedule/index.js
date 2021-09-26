import { Brief, Button, Panel, PanelItem } from 'weui-react-v2';
import React, { useState } from 'react';
import { Badge, Calendar } from 'antd';
import styles from '@/pages/Home/index.css';
import { ClockCircleOutlined, ExclamationCircleOutlined, QqOutlined } from '@ant-design/icons';

const Schedule = () =>{
  const [state, setState] =useState(true);
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

  return(
    <>
    <div style={{marginTop: 10, borderColor: '#3c6aac'}}>
      <Button style={{backgroundColor: '#3c6aac', color: 'white', marginLeft: '20%',width: '30%', height: 30}} onClick={()=>{setState(true)}}>仅提交报修</Button>
      <Button style={{backgroundColor: 'white', width: '30%',  color: '#3c6aac', height: 30}} onClick={()=>{setState(false)}}>保存并派单</Button>
    </div>
    <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />,
    { state ?
    <div >
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
    </div> :

      <div >
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
    }

  </>);
};
export default Schedule;
