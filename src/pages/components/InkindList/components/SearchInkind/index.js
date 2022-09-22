import React, { useState } from 'react';
import MyAntPopup from '../../../MyAntPopup';
import SkuInfo from '../SkuInfo';
import List from '../List';
import style from '../../index.less';
import MyCheck from '../../../MyCheck';
import { Button } from 'antd-mobile';
import { SkuResultSkuJsons } from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';
import { ToolUtil } from '../../../ToolUtil';

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
    className,
    hiddenHeader,
  },
) => {

  const [data, setData] = useState([]);

  const [inkinds, setInkinds] = useState([]);

  const [over, setOver] = useState(false);

  const skuResult = skuInfo.skuResult || {};
  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const imgResults = ToolUtil.isArray(skuResult.imgResults)[0] || {};
  const imgUrl = imgResults.thumbUrl;

  let inkindTotal = 0;
  let allInkinds = [];
  data.forEach(item => {
    const inkindList = item.inkindList || [];
    allInkinds = [...allInkinds, ...inkindList];
    inkindTotal += inkindList.length;
  });

  const checked = inkindTotal === inkinds.length;

  return <MyAntPopup
    afterShow={() => {
      const inkindList = document.getElementById('inkindList');
      if (inkindList) {
        inkindList.addEventListener('scroll', (event) => {
          const scrollTop = event.target.scrollTop;
          if (scrollTop > 85) {
            setOver(true);
          } else {
            setOver(false);
          }
        });
      }
    }}
    visible={visible && skuInfo.skuId}
    title={(!hiddenHeader && over) ? <div className={style.skuShow}>
      <img src={imgUrl || state.imgLogo} width='30' height='30' alt='' />
      {SkuResultSkuJsons({ skuResult, spu: true })} / {SkuResultSkuJsons({ skuResult, sku: true })}
    </div> : '库存明细'}
    onClose={() => {
      setData([]);
      onClose();
    }}
  >
    <div className={style.content} id='inkindList'>
      {!hiddenHeader && <SkuInfo sku={skuInfo.skuResult} />}
      <List
        over={over}
        className={className}
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
    </div>

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
