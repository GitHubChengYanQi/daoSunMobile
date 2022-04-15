import React, { useState } from 'react';
import { Button, Card, Dialog, Divider, Empty, List, Loading, Space, Steps, Toast } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { AuditOutlined, FormOutlined } from '@ant-design/icons';
import { useDebounceEffect } from 'ahooks';
import QualityTask from './components/QualityTask';
import { Avatar, Skeleton } from 'antd';
import PurchaseAsk from './components/PurchaseAsk';
import MentionsNote from '../../components/MentionsNote';
import BottomButton from '../../components/BottomButton';
import ImgUpload from '../../components/Upload/ImgUpload';
import Icon from '../../components/Icon';
import Process from '../PurchaseAsk/components/Process';
import InstockError from './components/InstockError';

const Workflow = (props) => {

  const query = props.location.query;

  const [detail, setDetail] = useState({});

  const [audit, setAudit] = useState([]);

  const [comments, setComments] = useState(false);

  const [imgs, setImgs] = useState([]);

  const [userIds, setUserIds] = useState([]);

  const [visible, setVisible] = useState(false);

  const [note, setNote] = useState('');

  const clearState = () => {
    setComments(false);
    setVisible(false);
    setNote('');
    setUserIds([]);
    setImgs([]);
  };

  // 执行审批接口
  const { loading, run: processLogRun } = useRequest(
    {
      url: '/audit/post',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Toast.show({
          content: '审批完成！',
          position: 'bottom',
        });
        clearState();
      },
      onError: () => {
        refresh();
        Toast.show({
          content: '审批失败！',
          position: 'bottom',
        });
        clearState();
      },
    },
  );

  // 任务评论
  const { loading: commentsLoading, run: taskComments } = useRequest(
    {
      url: '/audit/comments',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Toast.show({
          content: '评论完成！',
          position: 'bottom',
        });
        clearState();
      },
      onError: () => {
        refresh();
        Toast.show({
          content: '评论失败！',
          position: 'bottom',
        });
        clearState();
      },
    },
  );


  // 审批详情接口
  const { loading: detailLoading, run, refresh } = useRequest(
    {
      url: '/audit/detail',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res) {
          // 所有配置
          setAudit(res.stepsResult);
          // 详细数据
          setDetail(res);
        }

      },
    },
  );

  useDebounceEffect(() => {
    setDetail(null);
    if (query.id) {
      run({
        params: {
          taskId: query.id,
        },
      });
    }
  }, [], {
    wait: 0,
  });

  if (detailLoading)
    return <Skeleton loading={detailLoading} />;

  if (!detail)
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;

  const module = (value) => {
    switch (value) {
      case 'quality_task':
        return <QualityTask detail={detail.object} />;
      case 'purchase':
      case 'purchaseAsk':
        return <PurchaseAsk detail={detail.object} />;
      case 'instockError':
        return <InstockError id={detail.formId} />;
      default:
        break;
    }
  };


  return <div style={{
    backgroundColor: '#fff',
    overflowY: 'scroll',
    maxHeight: detail.permissions ? '90vh' : '100vh',
    overflowX: 'hidden',
  }}>
    <Card
      title={<div>{detail.taskName}</div>}
      bodyStyle={{ padding: 0 }}
    >

      {module(detail && detail.type)}

      <Divider contentPosition='left'>审批流程</Divider>

      <div>

        <Process auditData={audit} createName={detail.createName} />

      </div>
    </Card>

    {detail.remarks && detail.remarks.length > 0 ?
      <Card title={`评论(${detail.remarks.length})`} extra={<FormOutlined onClick={() => {
        setComments(true);
      }} />}>
        <List>
          {
            detail.remarks.map((items, index) => {
              return <List.Item
                key={index}
                title={items.user &&
                  <Space align='center'>
                    <Avatar
                      shape='square'
                      size={24}
                      style={{ fontSize: 14 }}>
                      {items.user.name.substring(0, 1)}
                    </Avatar>
                    {items.user.name}
                    {items.createTime}
                  </Space>}
                description={items.photoId && <div style={{ marginLeft: 32 }}><ImgUpload
                  disabled
                  length={5}
                  value={items.photoId.split(',').map((items) => {
                    return { url: items };
                  })} /></div>}
              >
                <div style={{ marginLeft: 32 }}>
                  {items.content}
                </div>
              </List.Item>;
            })
          }
        </List>
      </Card> :
      <div style={{ padding: 16 }}>
        <Button
          style={{ width: '100%' }}
          onClick={() => {
            setComments(true);
          }}
        >
          <FormOutlined /> 添加评论
        </Button>
      </div>}

    {detail.permissions && <BottomButton
      leftText='拒绝'
      leftOnClick={() => {
        setVisible('reject');
      }}
      rightText='同意'
      rightOnClick={() => {
        setVisible('agree');
      }}
    />}


    {/*审批同意或拒绝*/}
    <Dialog
      visible={visible || comments}
      title={comments ? '添加评论' : `是否${visible === 'agree' ? '同意' : '拒绝'}审批`}
      content={
        <MentionsNote
          placeholder={visible ? '添加备注，可@相关人员...' : '添加评论，可@相关人员...'}
          onChange={(value) => {
            setNote(value);
          }}
          value={note}
          getUserIds={(value) => {
            if (value && value.length > 0) {
            }
            const userIds = value.map((items) => {
              return items.value;
            });
            setUserIds(userIds);
          }}
          getImgs={(imgs) => {
            const imgIds = imgs.map((items) => {
              return items.id;
            });
            setImgs(imgIds);
          }}
        />
      }
      onAction={(action) => {
        if (action.key === 'confirm') {
          if (visible)
            processLogRun({
              data: {
                taskId: query.id,
                status: visible === 'agree' ? 1 : 0,
                userIds: userIds.filter((item, index) => {
                  return userIds.indexOf(item, 0) === index;
                }).toString(),
                photoId: imgs.toString(),
                note,
              },
            });
          else if (comments) {
            if (note)
              taskComments({
                data: {
                  taskId: query.id,
                  userIds: userIds.filter((item, index) => {
                    return userIds.indexOf(item, 0) === index;
                  }).toString(),
                  photoId: imgs.toString(),
                  note,
                },
              });
            else
              Toast.show({
                content: '请输入备注！',
                position: 'bottom',
              });
          }
        } else {
          setVisible(false);
          setComments(false);
        }
      }}
      actions={[
        [
          {
            key: 'close',
            text: '取消',
          },
          {
            disabled: loading || commentsLoading,
            key: 'confirm',
            text: loading || commentsLoading ? <Loading /> : (comments ? '发表' : '确定'),
          },
        ],
      ]}
    />
  </div>;

};

export default Workflow;
