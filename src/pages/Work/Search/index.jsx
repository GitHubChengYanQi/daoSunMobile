import React from 'react';
import { SearchBar } from 'antd-mobile';
import style from '../../components/MySearch/index.less';
import LinkButton from '../../components/LinkButton';

const Search = () => {


  return <>
    <div className={style.searchDiv}>
      <div className={style.search}>
        <SearchBar
          clearable
          className={style.searchBar}
          placeholder='请输入搜索内容'
        />
        <LinkButton className={style.submit} onClick={() => {

        }}>搜索</LinkButton>
      </div>
    </div>
  </>;
};

export default Search;
