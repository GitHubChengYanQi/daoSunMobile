import React, { useRef, useState } from 'react';
import MySearchBar from '../../components/MySearchBar';
import { Badge, CapsuleTabs, Card, Space } from 'antd-mobile';
import styles from './index.css';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import { getHeader } from '../../components/GetHeader';
import { ClockCircleOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import { history } from 'umi';

const Production = () => {

  const [data, setData] = useState([]);

  const ref = useRef();

  return <div className={styles.mainDiv}>
    <MyNavBar title='生产工单列表' />
    <div style={{ position: 'sticky', top: getHeader() ? 0 : 45, zIndex: 999 }}>
      <MySearchBar extra onChange={(value) => {
        ref.current.submit({ coding: value });
      }} />
      <CapsuleTabs defaultActiveKey='1' style={{ fontSize: 14, backgroundColor: '#fff' }}>
        <CapsuleTabs.Tab title='全部' key='1' />
        <CapsuleTabs.Tab title='未开始' key='2' />
        <CapsuleTabs.Tab title='执行中' key='3' />
        <CapsuleTabs.Tab title='已结束' key='4' />
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
                工单编号：{item.coding}
              </div>
              <div>
                工单主题：{item.theme}
              </div>
              <div>
                执行开始时间：{item.executionTime}
              </div>
              <div>
                执行结束时间：{item.endTime}
              </div>
              <div>
                负责人：{item.userResult && item.userResult.name}
              </div>
              <div>
                备注：{item.remark}
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
