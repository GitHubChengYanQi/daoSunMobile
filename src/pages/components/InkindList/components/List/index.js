import React, { useRef, useState } from 'react';
import MySearch from '../../../MySearch';
import MyList from '../../../MyList';
import { Button } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../ToolUtil';
import InkindItem from '../InkindItem';

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
    noActions,
  },
) => {

  const inkindIds = inkinds.map(item => item.inkindId);

  const ref = useRef();

  const [searchValue, setSearchValue] = useState();

  return <>
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

    <div className={style.list}>
      <div className={style.flex} style={{ padding: '8px 0' }}>
        <div className={style.flexGrow}>
          实物码只显示后6位！
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


  </>;
};

export default List;
