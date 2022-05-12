import { Dialog, Toast } from 'antd-mobile';
import { history } from 'umi';

const success = (title) => {
  Toast.show({
    content: title || '成功！',
    position: 'bottom',
  });
};

const dialogSuccess = (
  title,
  leftText,
  rightText,
  next = () => {
  }) => {
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
    actions: [[
      {
        key: 'back',
        text: leftText || '返回',
      },
      {
        key: 'next',
        text: rightText || '继续',
      },
    ],
    ],
  });
};

const error = (title) => {
  Toast.show({
    content: title || '失败！',
    position: 'bottom',
  });
};


export const Message = {
  success,
  error,
  dialogSuccess,
};

