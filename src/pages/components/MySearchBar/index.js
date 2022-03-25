import React from 'react';
import { Grid, SearchBar } from 'antd-mobile';
import LinkButton from '../LinkButton';
import styles from './index.css';

const MySearchBar = (
  {
    onChange = () => {
    },
    onSearch = () => {
    },
    onExtra = () => {
    },
    extra,
    style,
  }) => {

  return <div className={styles.search} style={{ padding: 8, backgroundColor: '#fff',zIndex:999, ...style }}>
    <Grid columns={24}>
      <Grid.Item span={extra ? 20 : 24}>
        <SearchBar
          placeholder='请输入内容'
          style={{ width: '100%', display: 'flex' }}
          onChange={onChange}
          onSearch={onSearch}
        />
      </Grid.Item>
      {extra && <Grid.Item span={4} style={{ textAlign: 'center', paddingTop: 4 }}>
        <LinkButton title='筛选' onClick={() => {
          onExtra();
        }} />
      </Grid.Item>}
    </Grid>


  </div>;
};

export default MySearchBar;
