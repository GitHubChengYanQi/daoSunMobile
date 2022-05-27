import React from 'react';
import { DeleteOutline } from 'antd-mobile-icons';

export const RemoveButton = (
    {
      onClick = () => {
      },
    }) => {
    return <DeleteOutline onClick={onClick} style={{ color: 'var(--adm-color-danger)',fontSize:14 }} />;
  }
;
