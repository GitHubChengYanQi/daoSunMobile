import { Dialog, Toast } from 'antd-mobile';
import { history } from 'umi';
import React from 'react';
import style from './index.less';
import { CheckCircleOutline, CloseCircleOutline, ExclamationTriangleOutline } from 'antd-mobile-icons';

const toast = (title) => {
  Toast.show({
    content: title || '成功！',
    position: 'bottom',
  });
};

const successToast = (
  title,
  afterClose = () => {
  },
  wait,
) => {
  if (!wait) {
    afterClose();
  }
  Toast.show({
    maskClassName: wait && style.toastMask,
    content: title || '成功！',
    icon: 'success',
    afterClose: wait && afterClose,
  });
};

const errorToast = (
  title,
  afterClose = () => {
  },
  wait,
) => {
  if (!wait) {
    afterClose();
  }
  Toast.show({
    content: title || '失败！',
    maskClassName: wait && style.toastMask,
    icon: 'fail',
    afterClose: wait && afterClose,
  });
};

const MyDialog = (
  {
    getContainer,
    only,
    content,
    confirmText = '确认',
    onConfirm,
    cancelText,
    onCancel,
    onClose,
    closeOnMaskClick,
  }) => {
  if (only) {
    Dialog.alert({
      content,
      confirmText,
      onConfirm,
    });
  } else {
    Dialog.confirm({
      content,
      confirmText,
      cancelText,
      onCancel,
      onConfirm,
      onClose,
      closeOnMaskClick,
      getContainer,
    });
  }
};

const successDialog = (
  {
    content,
    confirmText,
    cancelText,
    onCancel = () => {
    },
    onConfirm = () => {
    },
    only,
  }) => {

  const contentDom = <div className={style.successContent}>
    <CheckCircleOutline className={style.successIcon} />
    <div className={style.content}>{content}</div>
  </div>;

  MyDialog({
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    only,
    content: contentDom,
  });

};

const warningDialog = (
  {
    content,
    confirmText,
    cancelText,
    onCancel = () => {
    },
    onClose = () => {
    },
    onConfirm = () => {
    },
    getContainer,
    only = true,
    closeOnMaskClick,
  }) => {

  const contentDom = <div className={style.warningContent}>
    <ExclamationTriangleOutline className={style.waringIcon} />
    <div className={style.content}>{content}</div>
  </div>;

  MyDialog({
    getContainer,
    onClose,
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    closeOnMaskClick,
    only,
    content: contentDom,
  });

};

const errorDialog = (
  {
    content,
    confirmText,
    cancelText,
    onCancel = () => {
    },
    onConfirm = () => {
    },
    only = true,
  }) => {

  const contentDom = <div className={style.errorContent}>
    <CloseCircleOutline className={style.errorIcon} />
    <div className={style.content}>{content}</div>
  </div>;

  MyDialog({
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    only,
    content: contentDom,
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
  });
};


export const Message = {
  toast,
  successToast,
  errorToast,
  dialogSuccess,
  successDialog,
  warningDialog,
  errorDialog,
};

