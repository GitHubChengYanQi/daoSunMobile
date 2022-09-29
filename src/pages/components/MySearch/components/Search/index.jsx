import React, { useEffect, useRef, useState } from 'react';
import { List, SearchBar, Space } from 'antd-mobile';
import style from '../../index.less';
import LinkButton from '../../../LinkButton';
import MyNavBar from '../../../MyNavBar';
import MyCard from '../../../MyCard';
import MyRemoveButton from '../../../MyRemoveButton';
import { useRequest } from '../../../../../util/Request';
import { SearchOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../ToolUtil';

const historyList = { url: '/queryLog/list', method: 'POST' };
const historyAdd = { url: '/queryLog/add', method: 'POST' };
const historyDelete = { url: '/queryLog/deleteBatch', method: 'POST' };

const Search = (
  {
    defaultValue,
    historyType,
    onChange = () => {
    },
    onClose = () => {
    },
  }) => {

  const ref = useRef();

  const [value, setValue] = useState(defaultValue);

  const { data, refresh } = useRequest({
    ...historyList,
    data: {
      formType: historyType,
    },
  }, {
    manual: !historyType,
    onSuccess: () => {
      like(defaultValue);
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

  const [historys, setHistorys] = useState([]);

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

  const onSearch = (value) => {
    onChange(value);
  };

  const save = (value) => {
    run({ data: { record: value, formType: historyType } });
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
    ToolUtil.back({
      title: '',
      key: 'popup',
      onBack: onClose,
    });
  }, []);

  return <>
    <MyNavBar title='搜索' />
    <div className={style.searchDiv}>
      <div className={style.search}>
        <SearchBar
          ref={ref}
          clearable
          value={value}
          onChange={(value) => {
            setValue(value);
            like(value);
          }}
          onSearch={(value)=>{
            onSearch(value);
            save(value);
          }}
          className={style.searchBar}
          placeholder='请输入搜索内容'
        />
        <LinkButton className={style.submit} onClick={() => {
          onSearch(value);
          save(value);
        }}>搜索</LinkButton>
      </div>
    </div>

    {value && historys.length > 0 && <List style={{
      '--font-size': '14px',
    }}>
      {
        historys.map((item, index) => {
          return <List.Item
            arrow={false}
            prefix={<SearchOutline />}
            key={index}
            onClick={() => {
            onSearch(item.text);
          }}>
            {item.text}
          </List.Item>;
        })
      }
    </List>}

    <MyCard
      hidden={value}
      titleBom={<div className={style.historyTitle}>历史搜索</div>}
      extra={<MyRemoveButton onRemove={() => deleteRun({ data: { formType: historyType } })} />}
    >
      <Space wrap>
        {
          historys.map((item, index) => {
            return <div key={index} className={style.historyItem} onClick={() => {
              onSearch(item.text);
            }}>
              {item.text}
            </div>;
          })
        }
      </Space>
    </MyCard>

  </>;
};

export default Search;
