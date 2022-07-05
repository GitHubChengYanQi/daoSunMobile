import { Dialog, Toast } from 'antd-mobile';
import { history } from 'umi';

const toast = (title) => {
  Toast.show({
    content: title || '成功！',
    position: 'bottom',
  });
};

const dialogSuccess = (
  {
    title,
    leftText,
    rightText,
    next = () => {
    },
    only,
  }) => {

  const actions = [];

  if (!only) {
    actions.push({
      key: 'back',
      text: <div style={{ fontSize: 14 }}>{leftText || '返回'}</div>,
    });
  }
  actions.push({
    key: 'next',
    text: <div style={{ fontSize: 14 }}> {rightText || '继续'}</div>,
  });

  Dialog.show({
    content: title || '成功！',
    closeOnAction: true,
    onAction: (action) => {
      if (action.key === 'back') {
        history.goBack();
      } else {
        next();
      }
    },
    actions: [actions],
  })
};



export const Message = {
  toast,
  dialogSuccess,
};

