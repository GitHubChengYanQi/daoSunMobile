import React from 'react';
import MyNavBar from '../../components/MyNavBar';
import MyList from '../../components/MyList';
import { outstockOrderList } from '../../Scan/Url';
import { List, Space, Toast } from 'antd-mobile';
import { useSetState } from 'ahooks';
import { Badge } from 'antd';

const OutStock = () => {

  const [datas, setDatas] = useSetState({ data: [] });

  const status = (value) => {
    switch (value) {
      case 0:
        return <Badge text='待出库' color='red' />;
      case 1:
        return <Badge text='未完成' color='blue' />;
      case 2:
        return <Badge text='已完成' color='green' />;
      default:
        return null;
    }
  };

  return <>
    <MyNavBar title='库存信息' />
    <MyList
      api={outstockOrderList}
      data={datas.data}
      getData={(value) => {
        setDatas({ data: value });
      }}>
      <List>
        {
          datas.data && datas.data.map((item, index) => {
            return <List.Item
              title={item.coding}
              key={index}
              description={item.createTime}
              extra={status(item.state)}
              onClick={()=>{
                Toast.show({
                  content:'暂未开发,敬请期待!'
                });
              }}
            >
             <Space direction='vertical'>
               <div>仓库:{item.storehouseResult && item.storehouseResult.name}</div>
               <div>负责人:{item.userResult && item.userResult.name}</div>
             </Space>
            </List.Item>;
          })
        }
      </List>
    </MyList>
  </>;
};

export default OutStock;
