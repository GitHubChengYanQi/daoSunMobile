import React, { useRef, useState } from 'react';
import { Card, Space } from 'antd-mobile';
import styles from './index.less';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import { AddOutline, ClockCircleOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import Label from '../../components/Label';
import MySearch from '../../components/MySearch';
import MyFloatingBubble from '../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';

const Production = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const ref = useRef();

  return <div className={styles.mainDiv}>
    <MyNavBar title='生产工单列表' />
    <MySearch />
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
            title={<Space align='start' style={{ color: '#ffa52a', fontSize: 16 }}>
              <QuestionCircleOutline />待处理
            </Space>} className={styles.item}>
            <Space direction='vertical'>
              <div>
                <Label className={styles.label}>工单编号</Label>：{item.coding}
              </div>
              <div>
                <Label className={styles.label}>工单主题</Label>：{item.theme}
              </div>
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
              <Space>
                <ClockCircleOutline />{item.createTime}
              </Space>
            </Space>
          </Card>;
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
