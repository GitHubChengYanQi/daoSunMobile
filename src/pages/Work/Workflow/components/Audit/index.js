import React, { useState } from 'react';
import BottomButton from '../../../../components/BottomButton';
import { Button, Card, Dialog, List, Loading, Space, Toast } from 'antd-mobile';
import MentionsNote from '../../../../components/MentionsNote';
import { useRequest } from '../../../../../util/Request';
import { FormOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import ImgUpload from '../../../../components/Upload/ImgUpload';

const Audit = ({ detail = {},id,refresh }) => {

  const [visible, setVisible] = useState(false);

  const [comments, setComments] = useState(false);

  const [imgs, setImgs] = useState([]);

  const [userIds, setUserIds] = useState([]);

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


  if (!detail.permissions) {
    return <></>;
  }

  return <>

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
                    {items.user && items.user.name.substring(0, 1)}
                  </Avatar>
                  {items.user && items.user.name}
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

    {/* 审批同意或拒绝 */}
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
                taskId: id,
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
                  taskId: id,
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

    <BottomButton
      leftText='拒绝'
      leftOnClick={() => {
        setVisible('reject');
      }}
      rightText='同意'
      rightOnClick={() => {
        setVisible('agree');
      }}
    />
  </>;
};

export default Audit;
