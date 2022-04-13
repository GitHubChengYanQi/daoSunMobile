import React from 'react';
import { useRequest } from '../../../../util/Request';
import { List, Space, Tag } from 'antd-mobile';
import MyAntList from '../../../components/MyAntList';
import { history } from 'umi';
import Label from '../../../components/Label';
import MyEmpty from '../../../components/MyEmpty';
import { MyLoading } from '../../../components/MyLoading';

const MySend = () => {

  const { loading, data } = useRequest({
    url: '/remarks/sendList',
    method: 'POST',
    data: {
      status: 1,
    },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

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

  return <>
    <MyAntList>
      {
        data && data.map((items, index) => {
          const taskResult = items.taskResult || {};
          return <List.Item
            key={index}
            onClick={() => {
              history.push(`/Work/Workflow?id=${items.taskId}`);
            }}
          >
            <Space direction='vertical'>
              <div>
                <Label>名称：</Label>{taskResult.taskName}
              </div>
              <div>
                <Label>发起人：</Label>{taskResult.user && taskResult.user.name}
              </div>
              <div>
                <Label>类型：</Label>{type(taskResult.type)}
              </div>
              <div>
                <Label>创建时间：</Label>{items.createTime}
              </div>
            </Space>
          </List.Item>;
        })
      }
    </MyAntList>
  </>;
};

export default MySend;
