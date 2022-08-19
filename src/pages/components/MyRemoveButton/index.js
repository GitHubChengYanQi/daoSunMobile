import React from 'react';
import { Button, Space } from 'antd-mobile';
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
    style = {},
  },
) => {


  return <>
    <Button
      className={className}
      disabled={disabled}
      color='danger'
      fill='none'
      style={{ padding: 0, ...style }}
      onClick={() => {
        Message.warningDialog({
          content: content || '是否确认删除？',
          onConfirm: onRemove,
          only: false,
        });
      }}>
      <Space align={'center'} style={{'--gap':'4px'}}>{icon || <DeleteOutline style={{ fontSize: 14 }} />} {children}</Space>
    </Button>
  </>;
};

export default MyRemoveButton;
