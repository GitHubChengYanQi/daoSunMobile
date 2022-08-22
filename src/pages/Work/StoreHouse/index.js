import React from 'react';
import { storeHouseList } from '../Quality/Url';
import MyNavBar from '../../components/MyNavBar';
import style from './index.less'
import MyList from '../../components/MyList';
import { history } from 'umi';
import { useSetState } from 'ahooks';

const StoreHouse = () => {

  const [datas, setDatas] = useSetState({ data: [] });

  return <>
    <MyNavBar title='仓库管理' />

    <MyList
      api={storeHouseList}
      data={datas.data}
      getData={(value) => {
        setDatas({ data: value });
      }}>
      {
        datas.data && datas.data.map((items, index) => {
          return <div
            className={style.item}
            key={index}
            onClick={() => {
              history.push(`/Work/StoreHouse/StoreHousePositions?id=${items.storehouseId}`);
            }}
          >
            {items.name}
            <div>{items.palce}</div>
          </div>;
        })
      }
    </MyList>

  </>;
};

export default StoreHouse;
