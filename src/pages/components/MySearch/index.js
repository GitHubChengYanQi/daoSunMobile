import React, { useRef, useState } from 'react';
import { Popup, SearchBar } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../LinkButton';
import { SearchOutline } from 'antd-mobile-icons';
import { classNames, ToolUtil } from '../ToolUtil';
import Search from './components/Search';

const MySearch = (
  {
    placeholder,
    style: searchStyle,
    searchBarStyle = {},
    searchIcon = <SearchOutline />,
    extraIcon,
    className,
    noSearchButton,
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

  const searchRef = useRef();

  const [historyVisible, setHistoryVisible] = useState(false);

  const search = (value) => {
    onSearch(value);
  };

  return <div style={searchStyle} className={ToolUtil.classNames(style.searchDiv, className)}>
    <div
      className={classNames(style.search, historyType && style.disabledSearch)}
    >
      <div style={{ flexGrow: 1 }} onClick={(e) => {
        if (e.target.className === 'adm-input-clear' || ['path', 'rect'].includes(e.target.tagName)) {
          return;
        }
        historyType && setHistoryVisible(true);
      }}
      >
        <SearchBar
          style={searchBarStyle}
          icon={<div onClick={() => {
            searchIconClick();
          }}>
            {searchIcon}
          </div>}
          clearable
          onSearch={search}
          value={value}
          className={style.searchBar}
          placeholder={placeholder || '请输入搜索内容'}
          onChange={(value) => {
            onChange(value);
          }}
          onClear={() => {
            onSearch('');
            onChange('');
            onClear();
          }}
          onFocus={() => {
            setVisible(true);
            onFocus();
          }}
          onBlur={() => {
            setTimeout(() => {
              setVisible(false);
            }, 0);
          }}
        />
      </div>
      {
        !historyType && (visible || value) && !noSearchButton
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
      afterShow={() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }}
      style={{
        '--z-index': '1003',
      }}
      position='right'
      destroyOnClose
      visible={historyVisible}
      onClose={() => setHistoryVisible(false)}
    >
      <Search
        searchRef={searchRef}
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
