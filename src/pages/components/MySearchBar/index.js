import React from 'react';
import { Grid, SearchBar, Space } from 'antd-mobile';
import LinkButton from '../LinkButton';

const MySearchBar = (
  {
    onChange = () => {
    }, onSearch = () => {
  }, onExtra = () => {
  }, extra,
  }) => {

  return <div style={{ padding: 8 }}>
    <Grid columns={24}>
      <Grid.Item span={extra ? 20 : 24}>
        <SearchBar
          placeholder='请输入内容'
          style={{ '--background': '#ffffff', width: extra ? '80vw' : '90vw', display: 'flex' }}
          onChange={onChange}
          onSearch={onSearch}
        />
      </Grid.Item>
      {extra && <Grid.Item span={4} style={{ textAlign: 'center',paddingTop:4 }}>
        <LinkButton title='筛选' onClick={() => {
          onExtra();
        }} />
      </Grid.Item>}
    </Grid>


  </div>;
};

export default MySearchBar;
