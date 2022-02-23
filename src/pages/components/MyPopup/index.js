import React, { useImperativeHandle, useState } from 'react';
import { Card, Popup } from 'antd-mobile';
import LinkButton from '../LinkButton';
import { CloseOutline } from 'antd-mobile-icons';

const MyPopup = (
  {
    position,
    component: Component,
    title,
    onSuccess = () => {
    },
    onClose = () => {
    },
    ...props
  }, ref) => {

  const [visible, setVisible] = useState();

  const [value, setValue] = useState();

  const open = (value) => {
    setValue(value);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return <>
    <Popup
      visible={visible}
      onMaskClick={() => {
        close();
      }}
      position={position || 'right'}
    >
      <Card
        style={{ minWidth: '50vw' }}
        title={title || '选择'}
        extra={<LinkButton title={<CloseOutline />} onClick={() => {
          close();
        }} />}
      >
        <Component
          value={value}
          onSuccess={(value) => {
            onSuccess(value);
          }}
          onClose={() => {
            close();
          }}
        />
      </Card>
    </Popup>
  </>;
};

export default React.forwardRef(MyPopup);
