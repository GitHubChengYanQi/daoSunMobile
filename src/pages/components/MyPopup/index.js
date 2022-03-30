import React, { useImperativeHandle, useState } from 'react';
import { Card, Popup } from 'antd-mobile';
import LinkButton from '../LinkButton';
import { CloseOutline } from 'antd-mobile-icons';

const MyPopup = (
  {
    position,
    component: Component,
    title,
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
        style={{ minWidth: '50vw', height: '50vh', overflow: 'auto' }}
        title={title || '选择'}
        headerStyle={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 99 }}
        extra={<LinkButton title={<CloseOutline />} onClick={() => {
          close();
        }} />}
      >
        <Component
          {...props}
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
