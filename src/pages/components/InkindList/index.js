import React, { useImperativeHandle, useState } from 'react';
import MyAntPopup from '../MyAntPopup';
import List from './components/List';
import SkuInfo from './components/SkuInfo';
import style from './index.less';
import MyCheck from '../MyCheck';
import { Button } from 'antd-mobile';

const InkindList = (
  {
    onSuccess = () => {
    },
    addInkind = () => {
    },
    add,
  }, ref) => {

  const [visible, setVisible] = useState();

  const [skuInfo, setSkuInfo] = useState({});
  console.log(skuInfo);

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

  const open = ({ skuId, brandId, positionId, skuResult, maintenanceId }) => {
    setVisible(true);
    setSkuInfo({ skuId, brandId, storehousePositionsId: positionId, skuResult, maintenanceId });
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return <>
    <MyAntPopup
      visible={visible && skuInfo.skuId}
      title='库存实物'
      onClose={() => setVisible(false)}
    >
      <SkuInfo sku={skuInfo.skuResult} />
      <List
        add={add}
        addInkind={addInkind}
        data={data}
        setData={setData}
        inkinds={inkinds}
        setInkinds={setInkinds}
        skuInfo={skuInfo}
        onSuccess={onSuccess}
      />
      <div className={style.bottom}>
        <div className={style.all} onClick={() => {
          setInkinds(checked ? [] : allInkinds);
        }}>
          <MyCheck fontSize={16} checked={checked} />
          {checked ? '取消全选' : '全选'}
          <span>已选中 <span className='numberBlue'>{inkinds.length}</span> 类</span>
        </div>
        <Button className={style.submit} color='primary' disabled={inkinds.length === 0} onClick={() => {
          onSuccess(inkinds);
        }}>确定</Button>
      </div>
    </MyAntPopup>
  </>;
};

export default React.forwardRef(InkindList);
