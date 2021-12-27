import React, { useState } from 'react';
import { Affix } from 'antd';
import { Dropdown, List, Selector, Tag } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { history } from 'umi';
import { useSetState } from 'ahooks';
import { useRequest } from '../../../../util/Request';
import { Skeleton } from 'weui-react-v2';

const MyStart = () => {

  const { loading } = useRequest({
      url: '/rest/system/currentUserInfo',
      method: 'POST',
    },
    {
      onSuccess: (res) => {
        setSelect({
          ...select,
          createUser: res.userId,
        });
      },
    });

  const [taskType, setTaskType] = useState();

  const [taskStatus, setTaskStatus] = useState();

  const [select, setSelect] = useState({});

  const type = (value) => {
    switch (value) {
      case 'quality_task':
        return '质检任务';
      case 'purchase':
        return '采购申请';
      default:
        break;
    }
  };


  const [data, setData] = useSetState({});


  const status = (value) => {
    switch (value) {
      case -1:
        return <Tag color='primary' fill='outline'>
          进行中
        </Tag>;
      case 1:
        return <Tag color='#87d068' fill='outline'>
          已通过
        </Tag>;
      case 0:
        return <Tag color='#ff6430' fill='outline'>
          已拒绝
        </Tag>;
      default:
        break;
    }
  };

  if (loading)
    return <Skeleton loading={loading} />;


  return <>
    <Affix offsetTop={0}>
      <div>
        <Dropdown>
          <Dropdown.Item key='sorter' title={taskType ? taskType.label : '审批类型'}>
            <Selector
              columns={1}
              options={[{ label: '质检任务', value: 'quality_task' }, { label: '采购申请', value: 'purchase' }]}
              onChange={(arr, extend) => {
                setTaskType(extend.items[0]);
                setSelect({ ...select, type: arr[0] });
              }}
            />
          </Dropdown.Item>
          <Dropdown.Item key='bizop' title={taskStatus ? taskStatus.label : '审批状态'}>
            <Selector
              columns={1}
              options={[{ label: '进行中', value: 0 }, { label: '已通过', value: 1 }, { label: '已拒绝', value: 2 }]}
              onChange={(arr, extend) => {
                setTaskStatus(extend.items[0]);
                setSelect({ ...select, status: arr[0] });
              }}
            />
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Affix>
    <MyList
      api={{
        url: '/activitiProcessTask/list',
        method: 'POST',
      }}
      select={select}
      data={data}
      getData={(value) => {
        setData({ data: value });
      }}>
      <List>
        {
          data.data && data.data.map((items, index) => {
            return <List.Item
              key={index}
              title={type(items.type)}
              extra={status(items.status)}
              description={items.createTime}
              onClick={() => {
                history.push(`/Work/Workflow?id=${items.processTaskId}`);
              }}
            >
              发起人：{items.user && items.user.name}
            </List.Item>;
          })
        }
      </List>
    </MyList>
  </>;
};

export default MyStart;
