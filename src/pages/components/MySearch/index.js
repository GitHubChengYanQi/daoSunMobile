import React, { useEffect, useState } from 'react';
import { List, SearchBar, Card } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../LinkButton';
import { ClockCircleOutline, DeleteOutline, SearchOutline } from 'antd-mobile-icons';
import MyAntList from '../MyAntList';
import { useRequest } from '../../../util/Request';
import { ToolUtil } from '../ToolUtil';
import MyRemoveButton from '../MyRemoveButton';
import { useHistory, useLocation } from 'react-router-dom';

const historyList = { url: '/queryLog/list', method: 'POST' };
const historyAdd = { url: '/queryLog/add', method: 'POST' };
const historyDelete = { url: '/queryLog/deleteBatch', method: 'POST' };

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

  const history = useHistory();

  const [visible, setVisible] = useState();

  const { data, refresh } = useRequest({
    ...historyList,
    data: {
      formType: historyType,
    },
  }, {
    manual: !historyType,
    onSuccess: () => {
      like(value);
    },
  });

  const { run } = useRequest(historyAdd, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });
  const { run: deleteRun } = useRequest(historyDelete, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  const actions = Array.isArray(data) ? data.map(item => {
    return {
      text: item.record,
    };
  }) : [];

  const [historys, setHistorys] = useState(actions || []);


  const like = (value) => {
    const newArray = actions.filter(item => {
      if (value) {
        const patt = new RegExp(value, 'i');
        return patt.test(item.text);
      }
      return true;
    });
    setHistorys(newArray);
  };

  const search = (value) => {
    historyType && run({ data: { record: value, formType: historyType } });
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
          like(value);
        }}
        onClear={() => {
          onChange('');
          onClear();
        }}
        onFocus={() => {
          if (historyType) {
            history.push({
              pathname: '/Work/Search',
              query: {
                historyType,
              },
            });
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
  </div>;
};

export default MySearch;
