import React, { useState } from 'react';
import { Button, Card, Dialog, List, Loading, Space, Toast } from 'antd-mobile';
import { FormOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import MyAntList from '../../../components/MyAntList';
import MentionsNote from '../../../components/MentionsNote';
import { Message } from '../../../components/Message';
import ImgUpload from '../../../components/Upload/ImgUpload';
import { useRequest } from '../../../../util/Request';

const Comments = ({ detail = {}, id, refresh }) => {

  const [visible, setVisible] = useState(false);

  const [imgs, setImgs] = useState([]);

  const [userIds, setUserIds] = useState([]);

  const [note, setNote] = useState('');

  const clearState = () => {
    setVisible(false);
    setNote('');
    setUserIds([]);
    setImgs([]);
  };

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
        Toast.show({
          content: '评论失败！',
          position: 'bottom',
        });
        clearState();
      },
    },
  );

  return <>

    {detail.remarks && detail.remarks.length > 0 ?
      <Card title={`评论(${detail.remarks.length})`} extra={<FormOutlined onClick={() => {
        setVisible(true);
      }} />}>
        <MyAntList>
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
        </MyAntList>
      </Card> :
      <div style={{ padding: 16 }}>
        <Button
          style={{ width: '100%' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          <FormOutlined /> 添加评论
        </Button>
      </div>}

    {/* 审批同意或拒绝 */}
    <Dialog
      visible={visible}
      title='添加评论'
      content={
        <MentionsNote
          placeholder='添加评论，可@相关人员...'
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
          if (!note) {
            return Message.toast('请输入备注！');
          }
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
        } else {
          setVisible(false);
        }
      }}
      actions={[
        [
          {
            key: 'close',
            text: '取消',
          },
          {
            disabled: commentsLoading,
            key: 'confirm',
            text: commentsLoading ? <Loading /> : '发表',
          },
        ],
      ]}
    />

  </>;
};

export default Comments;
