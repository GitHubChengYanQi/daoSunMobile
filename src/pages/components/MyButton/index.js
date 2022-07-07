import React from 'react';
import { AddOutline, DeleteOutline } from 'antd-mobile-icons';
import { Button } from 'antd-mobile';
import style from './index.less';

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
  }) => {

  return <Button
    color={danger ? 'danger' : 'primary'}
    disabled={disabled}
    onClick={onClick}
    className={style.add}
  >
    <AddOutline />
  </Button>;
};
