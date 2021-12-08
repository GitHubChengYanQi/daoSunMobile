import React  from 'react';
import { Collapse, List, Toast } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import MyEmpty from '../../../components/MyEmpty';
import { router } from 'umi';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDebounceEffect } from 'ahooks';

const MainTask = ({ id }) => {

  const { data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' });

  const { data, run } = useRequest(
    {
      url: '/qualityTask/getTask',
      method: 'GET',
    },
    {
      manual: true,
    },
  );

  useDebounceEffect(() => {
    if (id) {
      run({
        params: {
          id,
        },
      });
    }
  }, [], {
    wait: 0,
  });

  if (!data) {
    return <MyEmpty />;
  }

  return <>
    <Collapse defaultActiveKey={['1', '2']}>
      <Collapse.Panel key='1' title={<>主任务信息</>}>
        <List.Item>编码：{data.coding}</List.Item>
        <List.Item>类型：{data.type}</List.Item>
        <List.Item>创建人：{data.user && data.user.name}</List.Item>
        <List.Item>备注：{data.fatherTask.remark || '无'}</List.Item>
        <List.Item>创建时间：{data.fatherTask.createTime}</List.Item>
      </Collapse.Panel>

      <Collapse.Panel key='2' title={<>子任务信息</>}>
        <List>
          {data.childTasks ?
            data.childTasks.map((items, index) => {
              return <List.Item
                key={index}
                title={<>分派人：{items.user && items.user.name} &nbsp;&nbsp; {items.createTime}</>}
                description={<>地点：{items.address}</>}
                clickable
                extra={items.state > 0 ?
                  <><CheckCircleOutlined style={{ color: 'green' }} /> &nbsp;&nbsp;完成</>
                  :
                  <><CloseCircleOutlined style={{ color: 'red' }} />&nbsp;&nbsp; 未完成</>
                }
                onClick={() => {
                  const userIds = items.users.filter((value) => {
                    return value.userId === user.userId;
                  });
                  if (userIds.length > 0) {
                    router.push(`/Work/Quality?id=${items.qualityTaskId}`);
                  } else {
                    Toast.show({
                      content: '您没有权限！',
                    });
                  }

                }}
              >
                质检人：{items.users && items.users.map((items) => {
                return items.name;
              }).toString()}
              </List.Item>;

            })
            :
            <MyEmpty />
          }
        </List>
      </Collapse.Panel>
    </Collapse>
  </>;
};
export default MainTask;
