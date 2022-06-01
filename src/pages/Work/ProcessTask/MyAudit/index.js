import React from 'react';
import { List, Space, Tag } from 'antd-mobile';
import { history } from 'umi';
import { useRequest } from '../../../../util/Request';
import MyAntList from '../../../components/MyAntList';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import Label from '../../../components/Label';

const MyAudit = () => {

  const { loading, data } = useRequest({
    url: '/remarks/auditList',
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
    <MyAntList>
      {
        data && data.map((items, index) => {
          const taskResult = items.taskResult || {};
          return <List.Item
            key={index}
            extra={status(items.status)}
            onClick={() => {
              history.push(`/Receipts/ReceiptsDetail?id=${items.taskId}`);
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

export default MyAudit;
