import React from 'react';
import { Button, Space } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';
import { Message } from '../Message';

const MyRemoveButton = (
  {
    hidden,
    children,
    onRemove = () => {
    },
    disabled,
    icon,
    className,
    content,
    style = {},
    dom: DOM,
  },
) => {

  const onClick = () => {
    Message.warningDialog({
      content: content || '是否确认删除？',
      onConfirm: onRemove,
      only: false,
    });
  };

  if (DOM) {
    return <DOM onClick={onClick} />;
  }

  return !hidden && <>
    <Button
      className={className}
      disabled={disabled}
      color='danger'
      fill='none'
      style={{ padding: 0, ...style }}
      onClick={onClick}>
      <Space align={'center'} style={{ '--gap': '4px' }}>{icon ||
      <DeleteOutline style={{ fontSize: 14 }} />} {children}</Space>
    </Button>
  </>;
};

export default MyRemoveButton;
