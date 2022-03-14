import React from 'react';
import { storeHouseList } from '../Quality/Url';
import MyNavBar from '../../components/MyNavBar';
import { List } from 'antd-mobile';
import MyList from '../../components/MyList';
import { history } from 'umi';
import { useSetState } from 'ahooks';
import { useRequest } from '../../../util/Request';

const StoreHouse = () => {

  const [datas, setDatas] = useSetState({ data: [] });

  const { data } = useRequest(storeHouseList);
  console.log(data);

  return <>
    <MyNavBar title='仓库管理' />

    <MyList
      api={storeHouseList}
      data={datas}
      getData={(value) => {
        setDatas({ data: value });
      }}>
      <List>
        {
          datas.data && datas.data.map((items, index) => {
            return <List.Item
              key={index}
              description={items.palce}
              onClick={() => {
                history.push(`/Work/StoreHouse/StoreHousePositions?id=${items.storehouseId}`);
              }}
            >
              {items.name}
            </List.Item>;
          })
        }
      </List>
    </MyList>

  </>;
};

export default StoreHouse;
