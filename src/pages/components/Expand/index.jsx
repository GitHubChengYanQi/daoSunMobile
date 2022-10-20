import React from 'react';
import { Divider } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';

const Expand = (
  {
    expand,
    onExpand = () => {
    },
  },
) => {


  return <Divider style={{
    color: '#808080',
    fontSize: 12,
    margin: 0,
    borderColor: '#F5F5F5',
  }}>
    <div onClick={() => {
      onExpand(!expand);
    }}>
      {
        expand ?
          <UpOutline />
          :
          <DownOutline />
      }
    </div>
  </Divider>;
};

export default Expand;
