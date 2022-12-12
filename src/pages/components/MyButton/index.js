import React from 'react';
import { AddOutline, DeleteOutline } from 'antd-mobile-icons';
import { Button } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../ToolUtil';

export const RemoveButton = (
  {
    onClick = () => {
    },
  }) => {
  return <DeleteOutline onClick={onClick} style={{ color: 'var(--adm-color-danger)', fontSize: 14 }} />;
};

export const AddButton = (
  {
    danger,
    disabled,
    onClick = () => {
    },
    width,
    height,
    className,
    children
  }) => {

  return <Button
    color={danger ? 'danger' : 'primary'}
    fill='outline'
    disabled={disabled}
    onClick={onClick}
    style={{ width, height }}
    className={ToolUtil.classNames(className,style.add)}
  >
    <AddOutline />{children}
  </Button>;
};
