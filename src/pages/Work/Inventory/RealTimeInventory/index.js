import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import Positions
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { Popup } from 'antd-mobile';
import scanImg from '../../../../assets/scan.png';
import style from './index.less';

const RealTimeInventory = () => {

  const [positionVisible, setPositionVisible] = useState();

  const [position, setPosition] = useState({});

  return <>
    <MyNavBar title='即时盘点' />

    <MySearch id='search' placeholder='请搜索库位进行盘点' onFocus={() => {
      const search = document.querySelector('#search input');
      search.blur();
      setPositionVisible(true);
    }} />

    <div className={style.scan}>
      <div className={style.scanImg}>
        <img src={scanImg} alt='' width={60} height={60} />
      </div>
      <div className={style.scanTitle}>
        请打开手机摄像头或使用手持终端扫描按键扫描库位码进行盘点
      </div>
    </div>

    <div className={style.inventoryLog}>
      <div>盘点记录</div>
    </div>

    <Popup visible={positionVisible} destroyOnClose>
      <Positions
        single
        autoFocus
        ids={[position]}
        onClose={() => setPositionVisible(false)}
        onSuccess={(value = []) => {
          setPositionVisible(false);
          console.log(value);
        }} />
    </Popup>
  </>;
};

export default RealTimeInventory;
