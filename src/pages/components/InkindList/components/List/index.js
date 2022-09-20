import React, { useRef, useState } from 'react';
import MySearch from '../../../MySearch';
import MyList from '../../../MyList';
import { Button, Space } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../ToolUtil';
import InkindItem from '../InkindItem';
import MyRadio from '../../../MyRadio';

const inkindList = { url: '/stockDetails/list', method: 'POST' };

const List = (
  {
    skuInfo = {},
    inkinds = [],
    setInkinds = () => {
    },
    data = [],
    setData = () => {
    },
    addInkind = () => {
    },
    add,
    api,
    className,
    noActions,
    over,
  },
) => {

  const inkindIds = inkinds.map(item => item.inkindId);

  const ref = useRef();

  const [searchValue, setSearchValue] = useState();

  const [status, setStatus] = useState('all');

  const screen = [
    { text: '全部', value: 'all', id: null },
    { text: '正常', value: 'init', id: 99 },
    { text: '异常', value: 'error', id: -1 },
  ];

  return <div className={className}>
    <MySearch
      className={style.search}
      value={searchValue}
      onChange={setSearchValue}
      placeholder='请输入实物码'
      onSearch={(value) => {
        ref.current.submit({ ...skuInfo, qrCodeid: value });
      }}
      onClear={() => {
        ref.current.submit({ ...skuInfo, qrCodeid: null });
      }}
    />
    <div className={style.statusList} style={{ boxShadow: over && '0 4px 5px 0 rgb(0 0 0 / 10%)' }}>
      <Space className={style.status}>
        {screen.map((item, index) => {
          return <MyRadio key={index} checked={status === item.value} onChange={() => {
            ref.current.submit({ ...skuInfo, qrCodeid: searchValue, status: item.id });
            setStatus(item.value);
          }}>{item.text}</MyRadio>;
        })}
      </Space>
    </div>


    <div className={style.list}>
      <div className={style.flex} style={{ padding: '8px 0' }}>
        <div className={style.flexGrow}>
          实物码只显示后6位数字！
        </div>
        {add && <Button color='primary' fill='outline' onClick={addInkind}>新增实物码</Button>}
      </div>
      <div className={style.inkindList}>
        <MyList
          ref={ref}
          params={skuInfo}
          api={api || inkindList}
          data={data}
          getData={(list) => {
            const newData = [];
            list.forEach(item => {
              const newPositionIds = newData.map(item => item.positionId);
              const newPositionIndex = newPositionIds.indexOf(item.storehousePositionsId);
              if (newPositionIndex !== -1) {
                const newPosition = newData[newPositionIndex];
                newData[newPositionIndex] = { ...newPosition, inkindList: [...newPosition.inkindList, item] };
              } else {
                newData.push({
                  positionId: item.storehousePositionsId,
                  name: ToolUtil.isObject(item.storehousePositionsResult).name,
                  storehouseName: ToolUtil.isObject(item.storehouseResult).name,
                  inkindList: [item],
                });
              }
            });
            setData(newData);
          }}
        >
          {
            data.map((item, index) => {
              return <InkindItem
                key={index}
                positionItem={item}
                inkindIds={inkindIds}
                setInkinds={setInkinds}
                inkinds={inkinds}
                noActions={noActions}
              />;
            })
          }
        </MyList>
      </div>

    </div>


  </div>;
};

export default List;
