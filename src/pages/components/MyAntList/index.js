import React from 'react';
import { List } from 'antd-mobile';

const MyAntList = ({ children, inner }) => {


  return <>
    <List
      style={{
        '--border-top': 'none',
        '--border-bottom': 'none',
        '--border-inner': inner && 'none',
      }}>
      {children}
    </List>
  </>;
};

export default MyAntList;
