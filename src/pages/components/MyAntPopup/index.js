import React from 'react';
import { Popup } from 'antd-mobile';
import style from './index.less';
import { CloseOutline } from 'antd-mobile-icons';

const MyAntPopup = (
  {
    zIndex,
    visible,
    children,
    title,
    destroyOnClose = true,
    className,
    onClose = () => {
    },
    afterShow = () => {
    },
    afterClose = () => {
    },
    leftText,
    rightText,
    onLeft = () => {
    },
    onRight = () => {
    },
    position,
  },
) => {


  return <>
    <Popup
      position={position}
      getContainer={null}
      style={{ '--z-index': zIndex }}
      afterShow={afterShow}
      afterClose={afterClose}
      visible={visible}
      onMaskClick={onClose}
      destroyOnClose={destroyOnClose}
      className={className}
    >
      <div className={style.header}>
        <span hidden={!leftText} className={style.left} onClick={onLeft}>{leftText}</span>
        {title || '无题'}
        <span className={style.right} onClick={() => {
          onClose();
          onRight();
        }}>{rightText || <CloseOutline />}</span>
      </div>
      {children}
    </Popup>
  </>;
};

export default MyAntPopup;
