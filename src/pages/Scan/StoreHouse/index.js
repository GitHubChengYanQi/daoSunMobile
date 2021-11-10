import { Card, Empty, List } from 'antd-mobile';


const StoreHouse = ({data}) => {

  if (!data){
    return   <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />
  }else {
    return (
      <>
        <Card title='仓库信息'>

          <List.Item>名称：{data.name}</List.Item>
          <List.Item>地点：{data.palce}</List.Item>
          <List.Item>经纬度：{data.longitude}，{data.latitude}</List.Item>
          <List.Item>面积：{data.measure}</List.Item>
          <List.Item>容量：{data.capacity}</List.Item>

        </Card>

        <Card title='库存列表'>
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无数据'
          />
        </Card>
      </>
    );
  }
};

export default StoreHouse;
