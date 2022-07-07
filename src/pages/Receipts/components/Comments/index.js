import React, { useImperativeHandle, useState } from 'react';
import { Button, Popup, Toast } from 'antd-mobile';
import { FormOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../util/Request';
import style from './index.less';
import { MyLoading } from '../../../components/MyLoading';
import Note from './components/Note';
import { Message } from '../../../components/Message';

const Comments = (
  {
    detail = {},
    id,
    refresh = () => {
    },
    title = '添加备注',
    onInput = () => {
    },
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
        Message.successToast('评论完成',()=>{
          refresh();
          onInput(false);
          setVisible(false);
        })
      },
      onError: () => {
        Message.errorToast('评论失败')
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

  return <>
    <div style={{ padding: 12, backgroundColor: '#fff' }}>
      <Button
        style={{ width: '100%' }}
        onClick={() => {
          setVisible(true);
        }}
      >
        <FormOutlined />{title}
      </Button>
    </div>

    <Popup destroyOnClose visible={visible} onMaskClick={() => {
      onInput(false);
      setVisible(false);
    }}>
      <Note
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
  </>;
};

export default React.forwardRef(Comments);
