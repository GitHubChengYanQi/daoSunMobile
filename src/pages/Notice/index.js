import React from 'react';
import { List, ListItem, SafeArea } from 'weui-react-v2';
import { WechatOutlined } from '@ant-design/icons';

const Notice = () => {

  return (
    <div>
      <SafeArea style={{ margin: '-0.16rem', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '5px 0 10px'}}>
        <List>
          <ListItem
            thumb={<WechatOutlined />}
            extra='说明文字'><div style={{fontSize:8 }}>客户分配通知</div></ListItem>
        </List>
      </SafeArea>
    </div>
  );
};

export default Notice;
