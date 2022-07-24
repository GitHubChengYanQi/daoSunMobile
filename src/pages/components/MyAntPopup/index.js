import React from 'react';
import { Popup } from 'antd-mobile';
import style from './index.less';
import { CloseOutline } from 'antd-mobile-icons';

const MyAntPopup = (
  {
    visible,
    children,
    title,
    destroyOnClose = true,
    className,
    onClose = () => {
    },
    afterShow = () => {
    },
  },
) => {


  return <>
    <Popup
      afterShow={afterShow}
      visible={visible}
      onMaskClick={onClose}
      destroyOnClose={destroyOnClose}
      className={className}
    >
      <div className={style.header}>
        {title || '无题'}
        <span onClick={() => {
          onClose();
        }}><CloseOutline /></span>
      </div>
      {children}
    </Popup>
  </>;
};

export default MyAntPopup;
