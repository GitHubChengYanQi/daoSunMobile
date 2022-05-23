import React, { useRef, useState } from 'react';
import MySearchBar from '../../components/MySearchBar';
import { Badge, CapsuleTabs, Card, Space } from 'antd-mobile';
import styles from './index.css';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import { ClockCircleOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import Label from '../../components/Label';
import { ToolUtil } from '../../components/ToolUtil';

const Production = () => {

  const [data, setData] = useState([]);

  const ref = useRef();

  return <div className={styles.mainDiv}>
    <MyNavBar title='生产工单列表' />
    <div style={{ position: 'sticky', top: ToolUtil.isQiyeWeixin() ? 0 : 45, zIndex: 999 }}>
      <MySearchBar extra onChange={(value) => {
        ref.current.submit({ coding: value });
      }} />
      <CapsuleTabs defaultActiveKey='1' style={{ backgroundColor: '#fff' }}>
        <CapsuleTabs.Tab title={<div>全部</div>} key='1' />
        <CapsuleTabs.Tab title={<div>未开始</div>} key='2' />
        <CapsuleTabs.Tab title={<div>执行中</div>} key='3' />
        <CapsuleTabs.Tab title={<div>已结束</div>} key='4' />
      </CapsuleTabs>
    </div>
    <MyList
      ref={ref}
      data={data}
      api={productionPlanList}
      getData={(data) => {
        setData(data.filter(() => true));
      }}>
      {
        data.map((item, index) => {
          return <Card
            onClick={() => {
              history.push(`/Work/Production/ProductionDetail?id=${item.productionPlanId}`);
            }}
            key={index}
            title={<Space align='start' style={{ color: '#ffa52a' }}>
              <QuestionCircleOutline />待处理
              <Badge color='#3291f8' content={<span style={{ fontSize: 14 }}>计划工单</span>} />
            </Space>} className={styles.item}>
            <Space direction='vertical'>
              <div>
                <Label>工单编号：</Label>{item.coding}
              </div>
              <div>
                <Label>工单主题：</Label>{item.theme}
              </div>
              <div>
                <Label>执行开始时间：</Label>{item.executionTime}
              </div>
              <div>
                <Label>执行结束时间：</Label> {item.endTime}
              </div>
              <div>
                <Label>负责人：</Label>{item.userResult && item.userResult.name}
              </div>
              <div>
                <Label>备注：</Label>{item.remark}
              </div>
              <Space>
                <ClockCircleOutline />{item.createTime}
              </Space>
            </Space>
          </Card>;
        })
      }
    </MyList>
  </div>;
};

export default Production;
