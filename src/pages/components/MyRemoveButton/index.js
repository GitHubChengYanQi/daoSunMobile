import React from 'react';
import { Button, Dialog } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';

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
      Dialog.confirm({
        content: '是否确认删除？',
        onConfirm:onRemove,
      });
    }}>
      <DeleteOutline style={{ fontSize:14 }} /> {children}
    </Button>
  </>;
};

export default MyRemoveButton;
