import React from 'react';
import { useRequest } from '../../../util/Request';
import MyEmpty from '../../components/MyEmpty';
import Subtasks from './Subtasks';
import MainTask from './MainTask';
import { useDebounceEffect } from 'ahooks';
import { Skeleton } from 'weui-react-v2';
import { Collapse, List } from 'antd-mobile';
import DispatchTask from './DispatchTask';

const Quality = (props) => {

  const query = props.location.query;

  // 质检任务详情的实物
  const { loading, data, run } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
  });

  useDebounceEffect(() => {
    if (query.id) {
      run({
        data: {
          qualityTaskId: query.id,
        },
      });
    }
  }, [props], {
    wait: 0,
  });

  if (loading) {
    return <Skeleton loading={loading} />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel key='1' title={<>质检任务信息</>}>
        <List
          style={{
            '--border-top':'none',
            '--border-bottom':'none',
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
        </List>
      </Collapse.Panel>
    </Collapse>
    {
      data.parentId ?
        <Subtasks id={data.qualityTaskId} />
        :
        <><DispatchTask taskDetail={data} /><MainTask id={data.qualityTaskId} /></>
    }
  </>;
};

export default Quality;
