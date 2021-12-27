import React from 'react';
import { request } from '../../../util/Request';
import { Dialog, Toast } from 'antd-mobile';
import { useDebounceEffect } from 'ahooks';

const CodeBind = (
  {
    complete,
    visible,
    title,
    data,
    onSuccess = () => {
    },
    onError = () => {
    },
    onClose = () => {
    },
  },
) => {

  useDebounceEffect(() => {
    if (visible && complete) {
      Dialog.alert({
        content: '已经全部绑定完成',
      });
      onError();
    }
  }, [visible],{
    wait:0
  });

  return !complete && <Dialog
    visible={visible}
    content={title}
    onAction={async (action) => {
      if (action.key === 'ok') {
        await request({
          url: '/orCode/backCode',
          method: 'POST',
          data,
        }).then((res) => {
          if (typeof res === 'string') {
            Toast.show({
              content: '绑定成功！',
              position: 'bottom',
            });
            onSuccess();
          } else {
            onError();
          }
        });
      } else {
        onClose();
      }
    }}
    actions={[
      [
        {
          key: 'ok',
          text: '是',
        },
        {
          key: 'no',
          text: '否',
        },
      ],
    ]}
  />;
};

export default CodeBind;
