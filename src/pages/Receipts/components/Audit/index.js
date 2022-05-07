import React, { useState } from 'react';
import { Button, Dialog, Space, Toast } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import MentionsNote from '../../../components/MentionsNote';

const Audit = ({ detail = {}, id, refresh }) => {

  const [visible, setVisible] = useState(false);

  const [agree, setAgree] = useState(false);

  const [imgs, setImgs] = useState([]);

  const [userIds, setUserIds] = useState([]);

  const [note, setNote] = useState('');

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
      },
      onError: () => {
        Toast.show({
          content: '审批失败！',
          position: 'bottom',
        });
      },
    },
  );


  if (!detail.permissions) {
    return <></>;
  }

  return <Space>

    <Button color='primary' fill='outline' onClick={() => {
      setAgree(true);
      setVisible(true);
    }}>同意</Button>
    <Button color='danger' fill='outline' onClick={() => {
      setAgree(false);
      setVisible(true);
    }}>拒绝</Button>

    {/* 审批同意或拒绝 */}
    <Dialog
      visible={visible}
      title={`是否${agree ? '同意' : '拒绝'}审批`}
      content={
        <MentionsNote
          placeholder='添加备注，可@相关人员...'
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
          processLogRun({
            data: {
              taskId: id,
              status: agree ? 1 : 0,
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
            disabled: loading,
            key: 'confirm',
            text: agree ?
              <span style={{ color: 'var(--adm-color-primary)' }}>同意</span>
              :
              <span style={{ color: 'var(--adm-color-danger)' }}>拒绝</span>,
          },
        ],
      ]}
    />
  </Space>;
};

export default Audit;
