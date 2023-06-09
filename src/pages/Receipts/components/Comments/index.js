import React, { useImperativeHandle, useState } from 'react';
import { Button, Card, Popup, Space } from 'antd-mobile';
import { FormOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import Note from './components/Note';
import { Message } from '../../../components/Message';

const Comments = (
  {
    all,
    detail = {},
    id,
    refresh = () => {
    },
    title = '添加备注',
    onInput = () => {
    },
    placeholder,
  }, ref) => {

  const [pid, setPid] = useState();

  const [visible, setVisible] = useState(false);
  // 任务评论
  const { loading: commentsLoading, run: taskComments } = useRequest(
    {
      url: '/audit/comments',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Message.toast('评论完成');
        refresh();
        onInput(false);
        setVisible(false);
      },
    },
  );

  const addComments = (id) => {
    setPid(id);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    addComments,
  }));

  return <div id='comments'>
    {all ? <Card title='评论' extra={<FormOutlined onClick={() => {
      setVisible(true);
    }} />} /> : <div style={{ padding: 12, backgroundColor: '#fff' }}>
      <Button
        fill='none'
        style={{ width: '100%', height: 40 }}
        onClick={() => {
          setVisible(true);
        }}
      >
        <Space align='center'><FormOutlined />{title}</Space>
      </Button>
    </div>}

    <Popup getContainer={null} destroyOnClose visible={visible} onMaskClick={() => {
      onInput(false);
      setVisible(false);
    }}>
      <Note
        getContainer={document.getElementById('comments')}
        placeholder={placeholder}
        textAreaId='commetsTextArea'
        autoFocus
        uploadId='commentImgs'
        onInput={onInput}
        onChange={({ userIds, mediaIds, note }) => {
          taskComments({
            data: {
              pid,
              taskId: id,
              userIds: userIds.toString(),
              photoId: mediaIds.toString(),
              note,
            },
          });
        }} />
    </Popup>

    {commentsLoading && <MyLoading />}
  </div>;
};

export default React.forwardRef(Comments);
