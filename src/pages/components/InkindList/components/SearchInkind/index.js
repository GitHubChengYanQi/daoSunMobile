import React, { useState } from 'react';
import MyAntPopup from '../../../MyAntPopup';
import SkuInfo from '../SkuInfo';
import List from '../List';
import style from '../../index.less';
import MyCheck from '../../../MyCheck';
import { Button } from 'antd-mobile';

const SearchInkind = (
  {
    skuInfo = {},
    onSuccess = () => {
    },
    addInkind = () => {
    },
    add,
    visible,
    onClose = () => {
    },
    api,
    noActions,
  },
) => {

  const [data, setData] = useState([]);

  const [inkinds, setInkinds] = useState([]);

  let inkindTotal = 0;
  let allInkinds = [];
  data.forEach(item => {
    const inkindList = item.inkindList || [];
    allInkinds = [...allInkinds, ...inkindList];
    inkindTotal += inkindList.length;
  });

  const checked = inkindTotal === inkinds.length;

  return <MyAntPopup
    visible={visible && skuInfo.skuId}
    title='库存实物'
    onClose={() => {
      setData([]);
      onClose();
    }}
  >
    <SkuInfo sku={skuInfo.skuResult} />
    <List
      noActions={noActions}
      api={api}
      add={add}
      addInkind={addInkind}
      data={data}
      setData={setData}
      inkinds={inkinds}
      setInkinds={setInkinds}
      skuInfo={skuInfo}
      onSuccess={onSuccess}
    />
    <div className={style.bottom} hidden={noActions}>
      <div className={style.all} onClick={() => {
        setInkinds(checked ? [] : allInkinds);
      }}>
        <MyCheck fontSize={16} checked={checked} />
        {checked ? '取消全选' : '全选'}
        <span>已选中 <span className='numberBlue'>{inkinds.length}</span> 类</span>
      </div>
      <Button className={style.submit} color='primary' disabled={inkinds.length === 0} onClick={() => {
        onSuccess(inkinds);
        setData([]);
        setInkinds([]);
      }}>确定</Button>
    </div>
  </MyAntPopup>;
};

export default SearchInkind;
