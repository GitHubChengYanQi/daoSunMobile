import React from 'react';
import { Dialog, Space } from 'antd-mobile';
import { Spin } from 'antd';

const MyDialog = ({visible,title}) => {

  return <Dialog
    visible={visible}
    content={
      <div style={{ textAlign: 'center' }}>
        <Space>
          <Spin />
          {title || '请等待...'}
        </Space>
      </div>
    }
  />;
};

export default MyDialog;
