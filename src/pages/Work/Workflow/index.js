import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Divider, Empty, Input, List, Loading, Steps, TextArea, Toast } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { CheckCircleOutlined, CloseCircleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { router } from 'umi';

const Workflow = (props) => {

  const query = props.location.query;

  const [detail, setDetail] = useState({});

  const [current, setCurrent] = useState({});

  const [audit, setAudit] = useState([]);

  const [visible, setVisible] = useState(false);

  const [note, setNote] = useState('');

  // 执行审批接口
  const { loading, run: processLogRun } = useRequest(
    {
      url: '/audit/post',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Toast.show({
          content: '审批完成！',
          position: 'bottom',
        });
        setVisible(false);
      },
      onError: () => {
        refresh();
        Toast.show({
          content: '审批失败！',
          position: 'bottom',
        });
        setVisible(false);
      },
    },
  );


  // 审批详情接口
  const { run, refresh } = useRequest(
    {
      url: '/audit/detail',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        let current = null;

        let number = 0;

        const arrays = [];

        res.logResults && res.logResults.map((items) => {
          if (items.stepsResult.serviceAudit.type !== 'route' && items.stepsResult.serviceAudit.type !== 'branch') {
            if (items.status === -1 && current === null) {
              current = {
                index: number,
                items: { ...items.stepsResult && items.stepsResult.serviceAudit, status: items.status },
                permissions: items.stepsResult.permissions,
              };
            } else {
              number++;
            }
            arrays.push({ ...items.stepsResult && items.stepsResult.serviceAudit, status: items.status });
          }

          return null;

        });

        setCurrent(current);
        setAudit(arrays);
        setDetail(res);
      },
    },
  );


  useEffect(() => {
    setDetail(null);
    if (query.id) {
      run({
        params: {
          taskId: query.id,
        },
      });
    }
  }, [props, query.id, run]);

  const Type = (value) => {
    switch (value) {
      case 'quality_task_person':
        return <>审批</>;
      case 'quality_task_send':
        return <>抄送</>;
      case 'quality_task_start':
        return <>发起人</>;
      case 'quality_task_dispatch':
        return <>分派任务</>;
      case 'quality_task_perform':
        return <>执行任务</>;
      case 'quality_task_complete':
        return <>完成任务</>;
      default:
        break;
    }
  };


  if (!detail) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  const status = (state) => {
    switch (state.type) {
      case 'quality_task_start':
        return <UserOutlined />;
      case 'quality_task_send':
        return <SendOutlined />;
      default:
        switch (state.status) {
          case 0:
            return <CloseCircleOutlined />;
          case 1:
            return <CheckCircleOutlined />;
          default:
            return <UserOutlined />;
        }
    }

  };

  const type = (value) => {
    switch (value) {
      case 'audit':
        return <>审核</>;
      default:
        break;
    }
  };

  const module = (value) => {
    switch (value) {
      case 'inQuality':
        return <>入厂检</>;
      default:
        break;
    }
  };

  return <div style={{ backgroundColor: '#fff' }}>
    <Card
      title='审批'
      bodyStyle={{ padding: 0 }}
    >
      <Divider contentPosition='left'>流程信息</Divider>
      {detail.activitiProcessTaskResult ?
        <>
          <List.Item>任务名称：{detail.activitiProcessTaskResult.taskName}</List.Item>
          <List.Item>类型：{type(detail.process.type)}</List.Item>
          <List.Item>功能：{module(detail.process.module)}</List.Item>
        </>
        :
        <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description='暂无数据'
        />
      }

      <Divider contentPosition='left'>质检任务信息</Divider>
      {detail ?
        <>
          <List.Item>质检编码：{detail.coding}
            <Button
              color='primary'
              fill='none'
              style={{ padding: 0, float: 'right' }}
              onClick={() => {
                router.push(`/Work/Workflow/QualityDetails?qualityTaskId=${detail.qualityTaskId}`);
              }}
            >查看详情
            </Button>
          </List.Item>
          <List.Item>质检类型：{detail.type}</List.Item>
          <List.Item>负责人：{detail.userName || '无'}</List.Item>
          <List.Item>备注：{detail.remark || '无'}</List.Item>
          <List.Item>创建时间：{detail.createTime}</List.Item>
        </>
        :
        <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description='暂无数据'
        />
      }
      <Divider contentPosition='left'>审批流程</Divider>

      <div style={{ marginBottom: '10vh' }}>

        <Steps direction='vertical' current={current.index}>
          {
            audit.map((item, index) => {
              if (item) {
                const users = [];
                if (item.rule && item.rule.qualityRules) {

                  item.rule.qualityRules.users.map((items) => {
                    return users.push(items.title);
                  });

                  item.rule.qualityRules.depts.map((items) => {
                    return users.push(`${items.title}(${items.positions && items.positions.map((items) => {
                      return items.label;
                    })})`);
                  });
                }
                if (item.type === 'quality_task_start') {
                  return <Steps.Step
                    key={index}
                    title={Type(item.type)}
                    description={detail.createName}
                    icon={status(item)} />;
                } else if (item.type === 'route' || item.type === 'branch') {
                  return null;
                } else {
                  return <Steps.Step
                    key={index}
                    title={Type(item.type)}
                    description={users.toString()}
                    icon={status(item)} />;
                }

              }
              return null;
            })
          }
        </Steps>
      </div>
    </Card>

    <div style={{
      width: '100%',
      zIndex: 99,
      paddingBottom: 0,
      position: 'fixed',
      bottom: 0,
      backgroundColor: '#fff',
    }}>
      {
        current.items
        &&
        current.items.type === 'quality_task_person'
        &&
        current.permissions
        &&
        <div style={{ padding: 16 }}>
          <Button
            color='primary'
            style={{ width: '50%', borderRadius: 0, borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}
            onClick={() => {
              setVisible('agree');
            }}>同意</Button>
          <Button
            color='default'
            style={{ width: '50%', borderRadius: 0, borderTopRightRadius: 50, borderBottomRightRadius: 50 }}
            onClick={() => {
              setVisible('reject');
            }}>拒绝</Button>
        </div>
      }
    </div>


    {/*审批同意或拒绝*/}
    <Dialog
      visible={visible}
      title={`是否${visible === 'agree' ? '同意' : '拒绝'}审批`}
      content={<TextArea
        placeholder='请输入备注...'
        rows={2}
        maxLength={50}
        showCount
        onChange={(value) => {
          setNote(value);
        }} />}
      onAction={(action) => {
        if (action.key === 'confirm') {
          processLogRun({
            params: {
              taskId: query.id,
              status: visible === 'agree' ? 1 : 0,
            },
          });
        } else {
          setVisible(false);
        }
      }}
      actions={[
        [
          {
            key: 'confirm',
            text: <Button style={{padding:0}} loading={loading} color='primary' size='large' fill='none'>确定</Button>,
          },
          {
            key: 'close',
            text: '取消',
          },
        ],
      ]}
    />
  </div>;

};

export default Workflow;
