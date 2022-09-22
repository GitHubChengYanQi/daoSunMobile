import React, { useRef, useState } from 'react';
import MySearch from '../../../MySearch';
import MyList from '../../../MyList';
import { Button, Popover } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../ToolUtil';
import InkindItem from '../InkindItem';
import { DownOutline, UpOutline } from 'antd-mobile-icons';

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

  const [status, setStatus] = useState('全部');

  const [visible, setVisible] = useState(false);

  const actions = [
    { text: '全部', key: 'all', id: null },
    { text: '正常', key: 'init', id: 99 },
    { text: '异常', key: 'error', id: -1 },
  ];

  return <div className={className}>
    <MySearch
      searchBarStyle={{ '--border-radius': '0' }}
      style={{ boxShadow: over && '0 4px 5px 0 rgb(0 0 0 / 10%)' }}
      extraIcon={<Popover.Menu
        onVisibleChange={setVisible}
        visible={visible}
        className={style.actions}
        actions={actions}
        placement='bottom-start'
        onAction={node => {
          ref.current.submit({ ...skuInfo, qrCodeid: searchValue, status: node.id });
          setStatus(node.text);
        }}
        trigger='click'
      >
        <div className={style.statusType}>
          {status} {visible ? <UpOutline /> : <DownOutline />}
        </div>
      </Popover.Menu>}
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


    <div className={style.list}>
      {add && <Button color='primary' fill='outline' onClick={addInkind}>新增实物码</Button>}
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
