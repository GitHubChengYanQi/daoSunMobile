import React, { useImperativeHandle, useState } from 'react';
import { Card, Popup } from 'antd-mobile';
import LinkButton from '../LinkButton';
import { CloseOutline } from 'antd-mobile-icons';

const MyPopup = (
  {
    position,
    width,
    height,
    component: Component,
    title,
    children,
    destroyOnClose = true,
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
      destroyOnClose={destroyOnClose}
      onMaskClick={() => {
        close();
      }}
      position={position || 'right'}
    >
      <Card
        style={{ minWidth: '50vw', width, height: height || '50vh', overflow: 'auto', padding: 0 }}
        title={<div>{title || '选择'}</div>}
        headerStyle={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 99, padding: 8 }}
        extra={<LinkButton title={<CloseOutline />} onClick={() => {
          close();
        }} />}
      >
        {Component ? <Component
          {...props}
          value={value}
          onSuccess={(value) => {
            onSuccess(value);
          }}
          onClose={() => {
            close();
          }}
        /> : children}
      </Card>
    </Popup>
  </>;
};

export default React.forwardRef(MyPopup);
