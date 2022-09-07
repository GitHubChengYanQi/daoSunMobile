import React, { useEffect } from 'react';
import MyCard from '../../components/MyCard';
import { Space } from 'antd-mobile';
import MyNavBar from '../../components/MyNavBar';
import Stock from '../components/Stock';
import ErrorSku from '../components/ErrorSku';
import InventoryRotation from '../components/InventoryRotation';
import OrderStatisicalChart from '../components/OrderStatisicalChart';
import TaskStatisicalChart from '../components/TaskStatisicalChart';
import MaterialAnalysis from '../components/MaterialAnalysis';
import { useRequest } from '../../../util/Request';
import { Message } from '../../components/Message';
import { menusAddApi } from '../../Home/MenusSetting';
import { connect } from 'dva';
import { MyLoading } from '../../components/MyLoading';
import MySwitch from '../../components/MySwitch';

const StatisticalChart = ({ ...props }) => {

  const userChart = props.data && props.data.userChart || [];

  const { loading: addLoading, run: addRun } = useRequest(menusAddApi, {
    manual: true,
    onSuccess: () => {
      Message.successToast('保存成功', () => {
        props.dispatch({ type: 'data/getUserChar' });
      });
    },
  });

  const extra = ({ code, name }) => {
    return <Space align='center'>常用列表 <MySwitch
      checked={userChart.filter(item => item.code === code).length > 0}
      onChange={(checked) => {
        let details = userChart;
        if (checked) {
          details.push({
            code,
            name,
          })
        }else {
          details = details.filter(item=>item.code !== code);
        }
        if (details.length === 0){
          Message.toast('最少保留一个图表！')
          return;
        }
        addRun({
          data: { details:details.map((item,index)=>({...item,sort:index})), type: 1 },
        });
      }} /></Space>;
  };

  useEffect(() => {
    if (userChart.length === 0) {
      props.dispatch({ type: 'data/getUserChar' });
    }
  }, []);

  return <>
    <MyNavBar title='统计图表设置' />
    <MyCard title='库存统计' extra={extra({ code: 'Stock', name: '库存统计' })}>
      <Stock />
    </MyCard>

    <MyCard title='异常分析' extra={extra({ code: 'ErrorSku', name: '异常分析' })}>
      <ErrorSku />
    </MyCard>

    <MyCard title='在库天数' extra={extra({ code: 'InventoryRotation', name: '在库天数' })}>
      <InventoryRotation />
    </MyCard>

    <MyCard title='单据统计' extra={extra({ code: 'OrderStatisicalChart', name: '单据统计' })}>
      <OrderStatisicalChart />
    </MyCard>

    <MyCard title='任务统计' extra={extra({ code: 'TaskStatisicalChart', name: '任务统计' })}>
      <TaskStatisicalChart />
    </MyCard>

    <MyCard title='物料分析' extra={extra({ code: 'MaterialAnalysis', name: '物料分析' })}>
      <MaterialAnalysis />
    </MyCard>

    {addLoading && <MyLoading />}
  </>;
};

export default connect(({ data }) => ({ data }))(StatisticalChart);
