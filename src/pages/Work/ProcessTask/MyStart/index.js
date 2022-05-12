import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, List, Selector, Space, Tag } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { history } from 'umi';
import Label from '../../../components/Label';
import { useModel } from 'umi';

const MyStart = (props) => {

  const { initialState } = useModel('@@initialState');
  console.log(initialState);

  const ref = useRef();

  const [taskType, setTaskType] = useState();

  const [taskStatus, setTaskStatus] = useState();

  const [select, setSelect] = useState({});

  const submit = (data) => {
    setSelect({
      ...select,
      ...data,
    });
    ref.current.submit({ ...select, ...data });
  };

  useEffect(() => {
    submit({ createUser: initialState.id });
  }, [initialState.id]);

  const [data, setData] = useState([]);

  const type = (value) => {
    switch (value) {
      case 'quality_task':
        return '质检任务';
      case 'purchase':
        return '采购申请';
      case 'instockError':
        return '入库异常';
      default:
        break;
    }
  };

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

  return <>
    <div style={{ position: 'sticky', top: 0, zIndex: 999, backgroundColor: '#fff' }}>
      <Dropdown>
        <Dropdown.Item key='sorter' title={<div>{taskType ? taskType.label : '审批类型'}</div>}>
          <Selector
            columns={1}
            options={[{ label: '质检任务', value: 'quality_task' }, { label: '采购申请', value: 'purchase' }]}
            onChange={(arr, extend) => {
              submit({ type: arr[0] });
              setTaskType(extend.items[0]);
            }}
          />
        </Dropdown.Item>
        <Dropdown.Item key='bizop' title={<div>{taskStatus ? taskStatus.label : '审批状态'}</div>}>
          <Selector
            columns={1}
            options={[{ label: '进行中', value: 0 }, { label: '已通过', value: 1 }, { label: '已拒绝', value: 2 }]}
            onChange={(arr, extend) => {
              submit({ status: arr[0] });
              setTaskStatus(extend.items[0]);
            }}
          />
        </Dropdown.Item>
      </Dropdown>
    </div>
    <MyList
      ref={ref}
      api={{
        url: '/activitiProcessTask/list',
        method: 'POST',
      }}
      data={data}
      getData={(value) => {
        setData(value.filter(item => true));
      }}>
      <List>
        {
          data && data.map((items, index) => {
            return <List.Item
              key={index}
              extra={status(items.status)}
              onClick={() => {
                history.push(`/Work/Workflow?id=${items.processTaskId}`);
              }}
            >
              <Space direction='vertical'>
                <div>
                  <Label>名称：</Label>{items.taskName}
                </div>
                <div>
                  <Label>发起人：</Label>{items.user && items.user.name}
                </div>
                <div>
                  <Label>类型：</Label>{type(items.type)}
                </div>
                <div>
                  <Label>创建时间：</Label>{items.createTime}
                </div>
              </Space>
            </List.Item>;
          })
        }
      </List>
    </MyList>
  </>;
};

export default MyStart;
