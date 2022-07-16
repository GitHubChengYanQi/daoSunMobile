import React from 'react';
import style from '../../Work/Stock/StockDetail/index.less';
import { ActionSheet } from 'antd-mobile';

const MyActionSheet = (
  {
    visible,
    onClose = () => {
    },
    actions = [],
    onAction = () => {
    },
  },
) => {


  return <>
    <ActionSheet
      className={style.action}
      cancelText='取消'
      visible={visible}
      actions={actions}
      onClose={onClose}
      onAction={onAction}
    />
  </>;
};

export default MyActionSheet;
