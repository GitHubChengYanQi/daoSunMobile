import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import style from '../ProcessTask/index.less';
import moment from 'moment';
import { classNames } from '../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import styles from './index.less';

const StockForewarn = () => {

  const screens = [
    { key: 'skuClass', title: '物料分类' },
    { key: 'status', title: '预警状态' },
    { key: 'purchaseStatus', title: '采购状态' },
  ];
  const [screen, setScreen] = useState({});
  const [screenKey, setScreenkey] = useState();

  return <>
    <MyNavBar title='库存预警' />
    <MySearch />
    <div className={styles.dropDown}>
      <div className={style.dropDown}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'type':
                title = screen.typeName;
                break;
              case 'createUser':
                title = screen.createUserName;
                break;
              case 'pickUserId':
                title = screen.userName;
                break;
              case 'createTime':
                title = params.startTime ? moment(params.startTime).format('MM/DD') + '-' + moment(params.endTime).format('MM/DD') : '';
                break;
              case 'customerId':
                title = screen.customerName;
                break;
              case 'status':
                title = screen.statusName;
                break;
            }
            const check = title || screenKey === item.key;
            return <div className={classNames(style.titleBox, check && style.checked)} key={item.key} onClick={() => {
              setScreenkey(item.key);
            }}>
              <div className={style.title}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
    </div>
  </>;
};

export default StockForewarn;
