import { Card, Empty, List } from 'antd-mobile';

const Spu = ({ data }) => {

  const Type = () => {
    switch (data.productionType) {
      case 0:
        return '自制件';
      case 1:
        return '委派件';
      case 2:
        return '外购件';
      default:
        break;
    }
  };

  if (!data){
    return   <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />
  }else {
    return (
      <>
        <Card title='物料信息'>

          <List.Item>类目：{data.category ? data.category.categoryName : '--'}</List.Item>
          <List.Item>物料名称：{data.name}</List.Item>
          <List.Item>型号：{data.model}</List.Item>
          <List.Item>分类：{data.spuClassificationResult ? data.spuClassificationResult.name : '--'}</List.Item>
          <List.Item>单位：{data.unitResult ? data.unitResult.unitName : '--'}</List.Item>
          <List.Item>养护周期：{data.curingCycle ? `${data.curingCycle}天` : '--'}</List.Item>
          <List.Item>生产类型：{Type()}</List.Item>
          <List.Item>重要程度：{data.important || '--'}</List.Item>
          <List.Item>产品重量：{data.weight || '--'}</List.Item>
          <List.Item>材质：{data.material ? data.material.name : '--'}</List.Item>
          <List.Item>成本：{data.cost || '--'}</List.Item>
          <List.Item>易损：{data.vulnerability === 0 ? '易损' : '不易损'}</List.Item>
          <List.Item>创建时间：{data.createTime}</List.Item>

        </Card>

        <Card title='属性信息'>
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

export default Spu;
