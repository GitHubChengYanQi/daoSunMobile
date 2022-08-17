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
    icon,
    className,
    content,
    style={},
  },
) => {


  return <>
    <Button  className={className} disabled={disabled} color='danger' fill='none' style={{ padding: 0,...style }} onClick={() => {
      Message.warningDialog({
        content: content || '是否确认删除？',
        onConfirm: onRemove,
        only: false,
      });
    }}>
      {icon || <DeleteOutline style={{ fontSize: 14 }} />} {children}
    </Button>
  </>;
};

export default MyRemoveButton;
