import React, { useEffect } from 'react';
import { useRequest } from '../../../util/Request';
import MyEmpty from '../../components/MyEmpty';
import Subtasks from './Subtasks';
import MainTask from './MainTask';
import { Skeleton } from 'weui-react-v2';
import { List } from 'antd-mobile';
import DispatchTask from './DispatchTask';
import MyFloatingPanel from '../../components/MyFloatingPanel';
import MyNavBar from '../../components/MyNavBar';

const Quality = (props) => {

  const query = props.location.query;

  // 质检任务详情的实物
  const { loading, data, run } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
  });

  useEffect(() => {
    if (query.id) {
      run({
        data: {
          qualityTaskId: query.id,
        },
      });
    }
  }, [props]);

  if (loading) {
    return <Skeleton loading={loading} />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const backgroundDom = () => {
    return <List
      style={{
        '--border-top': 'none',
        '--border-bottom': 'none',
      }}
    >
      {
        data.parentId ?
          <>
            <List.Item>指派人：{data.createName}</List.Item>
            <List.Item>指派时间：{data.createTime}</List.Item>
            <List.Item>质检人员：{data.names && data.names.toString()}</List.Item>
            <List.Item>质检地点：{data.address ? JSON.parse(data.address).address : '无'}</List.Item>
            <List.Item>质检时间：{data.time || '无'}</List.Item>
            <List.Item>联系人：{data.person || '无'}</List.Item>
            <List.Item>联系方式：{data.phone || '无'}</List.Item>
            <List.Item>备注：{data.note || '无'}</List.Item>
          </>

          :
          <>
            <List.Item>质检编码：{data.coding}</List.Item>
            <List.Item>质检类型：{data.type}</List.Item>
            <List.Item>负责人：{data.userName || '无'}</List.Item>
            <List.Item>创建时间：{data.createTime}</List.Item>
            <List.Item>备注：{data.remark || '无'}</List.Item>
          </>
      }
    </List>;
  };

  return <>
    <div style={{ position: 'sticky', top: 0 }}>
      <MyNavBar title='质检任务' />
    </div>
    <MyFloatingPanel
      backgroundColor
      backgroundDom={backgroundDom()}
    >
      {
        data.parentId ?
          <Subtasks id={data.qualityTaskId} />
          :
          <><DispatchTask taskDetail={data} /><MainTask id={data.qualityTaskId} /></>
      }
    </MyFloatingPanel>

  </>;
};

export default Quality;
