import React, { useState } from 'react';
import { List, SearchBar, Popover, Card } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../LinkButton';
import { ClockCircleOutline, DeleteOutline } from 'antd-mobile-icons';
import MyAntList from '../MyAntList';
import { useRequest } from '../../../util/Request';
import { ToolUtil } from '../ToolUtil';

const historyList = { url: '/queryLog/list', method: 'POST' };
const historyAdd = { url: '/queryLog/add', method: 'POST' };
const historyDelete = { url: '/queryLog/deleteBatch', method: 'POST' };

const MySearch = (
  {
    placeholder,
    searchIcon,
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
  }) => {

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

  const historyContent = () => {
    return <Card
      title='历史记录'
      headerStyle={{ fontSize: 14, padding: '8px 0' }}
      extra={<LinkButton onClick={() => {
        deleteRun({ data: { formType: historyType } });
      }}><DeleteOutline /></LinkButton>}
      style={{ padding: 0 }}
      bodyStyle={{ padding: 0 }}
    >
      <MyAntList>
        {historys.map((item, index) => {
          return <List.Item
            arrow={false}
            key={index}
            onClick={() => {
              onChange(item.text);
              onSearch(item.text);
            }}>
            <div style={{ fontSize: 12 }}>
              <ClockCircleOutline /> {item.text}
            </div>
          </List.Item>;
        })}
      </MyAntList>
    </Card>;
  };

  return <div className={ToolUtil.classNames(style.searchDiv, className)}>
    <Popover
      className={style.popover}
      style={{ width: 'calc(100% - 66px)' }}
      visible={(historyType && historys.length > 0) ? visible : false}
      placement='bottom-start'
      content={historyContent()}
      trigger='click'
    >
      <div className={style.search}>
        <div id='searchBar' className={style.searchBar}>
          <SearchBar
            icon={searchIcon}
            clearable
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
              setVisible(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setVisible(false);
              }, 0);
            }}
          />
        </div>

        {
          (visible || value)
            ?
            <LinkButton className={style.submit} onClick={() => {
              {
                historyType && run({ data: { record: value, formType: historyType } });
              }
              onSearch(value);
            }}>搜索</LinkButton>
            :
            <div hidden={!extraIcon} className={style.icon}>
              {extraIcon}
            </div>
        }
      </div>
    </Popover>
  </div>;
};

export default MySearch;
