import React, { useEffect, useState } from 'react';
import { CheckList } from 'antd-mobile';
import style from './index.less';
import { isArray } from '../../../util/ToolUtil';
import MyAntPopup from '../MyAntPopup';
import MySearch from '../MySearch';
import LinkButton from '../LinkButton';
import { useRequest } from '../../../util/Request';
import MyEmpty from '../MyEmpty';
import { MyLoading } from '../MyLoading';


const MyCheckList = (
  {
    anyLabel,
    noSearch,
    noPage,
    padding = 12,
    zIndex,
    visible,
    value = [],
    multiple,
    onClose = () => {
    },
    onChange = () => {
    },
    data = {},
    api,
    searchLabel,
    label,
    listKey,
    title,
    searchPlaceholder,
  },
) => {

  const [list, setList] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [checkList, setCheckList] = useState([]);

  const { loading, run } = useRequest(api, {
    manual: true,
    defaultParams: {
      data,
      params: noPage ? {} : { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      setList(isArray(res));
    },
  });

  const like = (string) => {
    run({
      data: { [searchLabel]: string, ...data },
      params: { limit: 10, page: 1 },
    });
  };

  useEffect(() => {
    if (visible) {
      noSearch ? run({ data: {} }) : like();
      setCheckList(value);
    }
  }, [visible]);


  return <>
    <MyAntPopup
      onClose={() => onClose()}
      zIndex={zIndex}
      title={title || '选择'}
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange(multiple ? checkList : (checkList[0] || {}));
      }}>确定</LinkButton>}
    >
      <div style={{ padding, maxHeight: '60vh', overflow: 'auto' }}>
        {!noSearch && <MySearch
          placeholder={searchPlaceholder}
          className={style.searchBar}
          onSearch={(value) => {
            like(value);
          }}
          onChange={setSearchValue}
          value={searchValue}
          onClear={like}
        />}
        {!loading && list.length === 0 && <MyEmpty />}
        {loading ? <MyLoading skeleton /> : <CheckList
          style={{
            '--border-inner': 'solid 1px #f5f5f5',
            '--border-top': 'solid 1px #f5f5f5',
            '--border-bottom': 'solid 1px #f5f5f5',
          }}
          className={style.list}
          value={checkList.map(item => item[listKey])}
        >
          {anyLabel && <CheckList.Item
            value='any'
            onClick={() => {
              if (multiple) {
                setCheckList(checkList.map(item => item[listKey]).includes('any') ?
                    checkList.filter(listItem => listItem[listKey] !== 'any') :
                    [...checkList,{ [listKey]: 'any', [label]: anyLabel }]);
              } else {
                setCheckList(checkList.map(item => item[listKey]).includes('any') ? [] : [{
                  [listKey]: 'any',
                  [label]: anyLabel,
                }]);
              }
            }}
          >
            {anyLabel}
          </CheckList.Item>}
          {
            list.map((item, index) => {
              const checked = checkList.find(listItem => {
                return listItem[listKey] === item[listKey];
              });

              return <CheckList.Item
                key={index}
                value={item[listKey]}
                onClick={() => {
                  if (multiple) {
                    setCheckList(checked ? checkList.filter(listItem => listItem[listKey] !== item[listKey]) : [...checkList, item]);
                  } else {
                    setCheckList(checked ? [] : [item]);
                  }
                }}
              >
                {item[label]}
              </CheckList.Item>;
            })
          }
        </CheckList>}
      </div>
    </MyAntPopup>
  </>;
};

export default MyCheckList;
