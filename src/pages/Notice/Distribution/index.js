import React from 'react';
import { SearchBar } from 'antd-mobile';
import { Button, List, ListItem } from 'weui-react-v2';
import { UserOutlined } from '@ant-design/icons';

const Distribution = () => {

  return (
    <>
      <div style={{backgroundColor:'#fff',padding:8}}>
        <SearchBar style={{backgroundColor:'#fff',border:'solid 1px #eee',borderRadius:100}} placeholder="搜索项目" maxLength={8} />
        <div style={{marginTop:8}}>
          <Button style={{width:'50%'}}>排序</Button><Button style={{width:'50%'}}>筛选</Button>
        </div>
      </div>
      <List title="带图标，说明, 跳转的列表">
        <ListItem arrow={true} thumb={<UserOutlined />} extra="说明文字">
          标题文字
        </ListItem>
        <ListItem arrow={true} thumb={<UserOutlined />} extra="说明文字">
          标题文字
        </ListItem>
      </List>
    </>
  );
};

export default Distribution;
