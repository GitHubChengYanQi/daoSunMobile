import React, { useEffect, useState } from 'react';
import { Popup, SearchBar } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../LinkButton';
import { SearchOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../ToolUtil';
import { useHistory, useLocation } from 'react-router-dom';
import Search from './components/Search';

const MySearch = (
  {
    placeholder,
    style: searchStyle,
    searchBarStyle,
    searchIcon = <SearchOutline />,
    extraIcon,
    className,
    onSearch = () => {
    },
    value,
    onChange = () => {
    },
    onClear = () => {
    },
    historyType,
    searchIconClick = () => {
    },
    onFocus = () => {
    },
  }) => {

  const [visible, setVisible] = useState();

  const [historyVisible, setHistoryVisible] = useState(false);

  const search = (value) => {
    onSearch(value);
  };

  return <div style={searchStyle} className={ToolUtil.classNames(style.searchDiv, className)}>
    <div className={style.search}>
      <SearchBar
        style={searchBarStyle}
        icon={<div onClick={() => {
          searchIconClick();
        }}>
          {searchIcon}
        </div>}
        clearable
        onSearch={(value) => {
          search(value);
        }}
        value={value}
        className={style.searchBar}
        placeholder={placeholder || '请输入搜索内容'}
        onChange={(value) => {
          onChange(value);
        }}
        onClear={() => {
          onChange('');
          onClear();
        }}
        onFocus={() => {
          if (historyType) {
            setHistoryVisible(true);
            return;
          }
          setVisible(true);
          onFocus();
        }}
        onBlur={() => {
          setTimeout(() => {
            setVisible(false);
          }, 0);
        }}
      />

      {
        (visible || value)
          ?
          <LinkButton className={style.submit} onClick={() => {
            search(value);
          }}>搜索</LinkButton>
          :
          <div hidden={!extraIcon} className={style.icon}>
            {extraIcon}
          </div>
      }
    </div>

    <Popup
      style={{
        '--z-index': '1003',
      }}
      position='right'
      destroyOnClose
      visible={historyVisible}
      onClose={() => setHistoryVisible(false)}
    >
      <Search
        defaultValue={value}
        onChange={(value) => {
          onSearch(value);
          onChange(value);
          setHistoryVisible(false);
        }}
        onClose={() => setHistoryVisible(false)}
        historyType={historyType}
      />
    </Popup>
  </div>;
};

export default MySearch;
