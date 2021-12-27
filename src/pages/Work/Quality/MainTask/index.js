import React from 'react';
import { Collapse, List } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import MyEmpty from '../../../components/MyEmpty';
import { history } from 'umi';
import { useDebounceEffect } from 'ahooks';
import { Badge } from 'antd';

const MainTask = ({ id }) => {

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

  const taskState = (value) => {
    switch (value) {
      case -1:
        return <Badge text='已拒绝' color='red' />;
      case 1:
        return <Badge text='进行中' color='yellow' />;
      case 2:
        return <Badge text='已完成' color='blue' />;
      case 3:
        return <Badge text='已入库' color='green' />;
      default:
        break;
    }
  };

  return <>
    <Collapse defaultActiveKey={['1', '2']}>
      <Collapse.Panel key='1' title={<>子任务信息</>}>
        <List
          style={{ border: 'none' }}
        >
          {data.childTasks && data.childTasks.length > 0 ?
            data.childTasks.map((items, index) => {
              return <List.Item
                key={index}
                title={<>指派人：{items.user && items.user.name} &nbsp;&nbsp; {items.createTime}</>}
                description={items.state > 0 ?
                  <>地点：{items.address && JSON.parse(items.address).address}</>
                  :
                  <>原因：{items.note || '无'}</>
                }
                clickable
                extra={taskState(items.state)}
                onClick={() => {
                  history.push(`/Work/Quality?id=${items.qualityTaskId}`);
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
      <Collapse.Panel key='2' title={<>驳回物料信息</>}>
        <List
          style={{ border: 'none' }}
        >
          {data.refuse && data.refuse.length > 0 ?
            data.refuse.map((items, index) => {
                return <List.Item
                  key={index}
                  title={<>驳回人：{items.user && items.user.name}</>}
                  description={<>{items.createTime} <br/>原因：{items.note || '无'}</>}
                >
                  {items.skuResult && items.skuResult.skuName}
                  &nbsp;/&nbsp;
                  {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
                  &nbsp;&nbsp;
                  <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                    (
                    {
                      items.skuResult
                      &&
                      items.skuResult.list
                      &&
                      items.skuResult.list.map((items, index) => {
                        return (
                          <span key={index}>{items.itemAttributeResult.attribute}：{items.attributeValues}</span>
                        );
                      })
                    }
                    )
                  </em>
                  <br/>
                  {items.brandResult && items.brandResult.brandName}
                  &nbsp;&nbsp; × {items.number}
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
