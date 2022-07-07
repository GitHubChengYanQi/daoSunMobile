import React from 'react';
import { Button } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';
import { Message } from '../Message';

const MyRemoveButton = (
  {
    children,
    onRemove = () => {
    },
    disabled,
  },
) => {


  return <>
    <Button disabled={disabled} color='danger' fill='none' style={{ padding: 0 }} onClick={() => {
      Message.warningDialog({
        content: '是否确认删除？',
        onConfirm:onRemove,
        only:false,
      });
    }}>
      <DeleteOutline style={{ fontSize:14 }} /> {children}
    </Button>
  </>;
};

export default MyRemoveButton;
