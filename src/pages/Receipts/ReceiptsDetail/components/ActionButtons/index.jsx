import React, { useEffect, useState } from 'react';
import style from '../Bottom/index.less';
import { MoreOutline } from 'antd-mobile-icons';
import MyActionSheet from '../../../../components/MyActionSheet';
import { Button, Dialog, TextArea } from 'antd-mobile';
import { useModel } from 'umi';
import { useRequest } from '../../../../../util/Request';
import { Message } from '../../../../components/Message';
import { MyLoading } from '../../../../components/MyLoading';

export const postRevoke = { url: '/audit/revoke', method: 'POST' };

const ActionButtons = (
  {
    createUser,
    permissions,
    actions = [],
    taskId,
    logIds,
    onClick = () => {
    },
    afertShow = () => {
    },
    refresh = () => {
    },
  }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const { loading, run } = useRequest(postRevoke, {
    manual: true,
    onSuccess: () => Message.successToast('撤回成功！', () => {
      if (openNote === 'revokeAndAsk') {
        onClick('revokeAndAsk');
      }
      refresh();
      setOpenNote(false);
    }, true),
    onError: () => refresh(),
  });

  actions = actions.filter(item => {
    if (item.action === 'revoke') {
      return createUser === userInfo.id;
    } else {
      return permissions;
    }
  });

  const [visible, setVisible] = useState();

  const [note, setNote] = useState('');

  const [openNote, setOpenNote] = useState('');

  const [revoke, setRevoke] = useState();

  const actionClick = (action) => {
    switch (action) {
      case 'revoke':
        setRevoke(true);
        break;
      case 'resubmit':
        onClick('revokeAndAsk');
        break;
      default:
        onClick(action);
        break;
    }
  };

  const buttons = () => {
    switch (actions.length) {
      case 1:
        return <Button disabled={actions[0].disabled} className={style.only} color='primary' onClick={() => {
          actionClick(actions[0].action);
        }}>
          {actions[0].name}
        </Button>;
      case 2:
        return <>
          <div className={style.buttons}>
            <Button
              disabled={actions[1].disabled}
              className={style.reject}
              color='primary'
              fill='outline'
              onClick={() => {
                actionClick(actions[1].action);
              }}>
              {actions[1].name}
            </Button>
            <Button disabled={actions[0].disabled} className={style.ok} color='primary' onClick={() => {
              actionClick(actions[0].action);
            }}>
              {actions[0].name}
            </Button>
          </div>
        </>;
      default:
        return <>
          <div className={style.actions}>
            <div className={style.all} onClick={() => {
              setVisible(true);
            }}>
              <div>更多</div>
              <MoreOutline />
            </div>
            <div className={style.buttons}>
              <Button
                disabled={actions[1].disabled}
                className={style.reject}
                color='primary'
                fill='outline'
                onClick={() => {
                  actionClick(actions[1].action);
                }}>
                {actions[1].name}
              </Button>
              <Button disabled={actions[0].disabled} className={style.ok} color='primary' onClick={() => {
                actionClick(actions[0].action);
              }}>
                {actions[0].name}
              </Button>
            </div>
          </div>

          <MyActionSheet
            onAction={(action) => {
              actionClick(action.key);
              setVisible(false);
            }}
            visible={visible}
            actions={actions.filter((item, index) => index > 1).map(item => ({
              text: item.name,
              key: item.action,
              disabled: item.disabled,
            }))}
            onClose={() => setVisible(false)} />
        </>;
    }
  };

  useEffect(() => {
    if (actions.length > 0) {
      afertShow();
    }
  }, [actions.length]);

  if (actions.length === 0) {
    return <></>;
  }

  return <div className={style.actionBottom}>
    {buttons()}

    <MyActionSheet
      onAction={(action) => {
        setOpenNote(action.key);
        setRevoke(false);
      }}
      visible={revoke}
      actions={[
        { text: '撤回', key: 'revoke' },
        { text: '撤销并重新发起', key: 'revokeAndAsk' },
      ]} onClose={() => setRevoke(false)} />

    <Dialog
      visible={openNote}
      title='请输入撤回原因'
      content={<TextArea value={note} rows={3} placeholder='请输入撤回原因' onChange={setNote} />}
      actions={[[
        { text: '确定', key: 'ok' },
        { text: '取消', key: 'cancal' },
      ]]}
      onAction={(action) => {
        if (action.key === 'ok') {
          run({
            data: {
              taskId,
              logIds,
              revokeContent: note,
            },
          });
        } else {
          setOpenNote('');
        }
      }}
    />

    {loading && <MyLoading />}
  </div>;
};

export default ActionButtons;
