import React, { useRef, useState } from 'react';
import { Space, Tabs } from 'antd-mobile';
import styles from './index.less';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import { AddOutline } from 'antd-mobile-icons';
import Label from '../../components/Label';
import MySearch from '../../components/MySearch';
import MyFloatingBubble from '../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';
import { MyDate } from '../../components/MyDate';

const Production = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const ref = useRef();

  return <div className={styles.mainDiv}>
    <MyNavBar title='计划列表' />
    <MySearch />

    <Tabs className={styles.tabs}>
      <Tabs.Tab title='全部' key='1' />
      <Tabs.Tab title='未开始' key='2' />
      <Tabs.Tab title='执行中' key='3' />
      <Tabs.Tab title='已结束' key='4' />
    </Tabs>
    <MyList
      ref={ref}
      data={data}
      api={productionPlanList}
      getData={(data) => {
        setData(data.filter(() => true));
      }}>
      {
        data.map((item, index) => {
          return <div
            onClick={() => {
              history.push(`/Work/Production/ProductionDetail?id=${item.productionPlanId}`);
            }}
            key={index}
            className={styles.item}
          >
            <div className={styles.title}>
              <div className={styles.status}>
                <div className={styles.theme}>{item.theme} / {item.coding}</div>
                <div style={{ border: `solid 1px #599745`, color: '#599745' }} className={styles.statusName}>
                  待处理
                </div>
              </div>
              <div className={styles.time}>{MyDate.Show(item.createTime)}</div>
            </div>
            <Space direction='vertical'>
              <div>
                <Label className={styles.label}>开始时间</Label>：{item.executionTime}
              </div>
              <div>
                <Label className={styles.label}>结束时间</Label>： {item.endTime}
              </div>
              <div>
                <Label className={styles.label}>负责人</Label>：{item.userResult && item.userResult.name}
              </div>
              <div>
                <Label className={styles.label}>备注</Label>：{item.remark}
              </div>
            </Space>
          </div>;
        })
      }
    </MyList>

    <MyFloatingBubble>
      <AddOutline style={{ color: 'var(--adm-color-primary)' }} onClick={() => {
        history.push('/Work/Production/CreatePlan');
      }} />
    </MyFloatingBubble>
  </div>;
};

export default Production;
