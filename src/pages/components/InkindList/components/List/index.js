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
  },
) => {

  const inkindIds = inkinds.map(item => item.inkindId);

  const ref = useRef();

  const [searchValue, setSearchValue] = useState();

  const [status, setStatus] = useState('all');

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
    <div className={style.statusList}>
      <Space className={style.status}>
        <MyRadio checked={status === 'all'} onChange={() => setStatus('all')}>全部</MyRadio>
        <MyRadio checked={status === 'init'} onChange={() => setStatus('init')}>正常</MyRadio>
        <MyRadio checked={status === 'error'} onChange={() => setStatus('error')}>异常</MyRadio>
      </Space>
    </div>


    <div className={style.list}>
      <div className={style.flex} style={{ padding: '8px 0' }}>
        <div className={style.flexGrow}>
          实物码只显示后6位数字！
        </div>
        {add && <Button color='primary' fill='outline' onClick={addInkind}>新增二维码</Button>}
      </div>
      <div className={style.inkindList}>
        <MyList
          ref={ref}
          params={skuInfo}
          api={api || inkindList}
          data={data}
          getData={(list, newList) => {
            const positionIds = list.map(item => item.storehousePositionsId);
            const newData = data.filter(item => positionIds.includes(item.positionId));
            newList.forEach(item => {
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
