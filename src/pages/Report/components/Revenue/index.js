import React, { useEffect } from 'react';
import { Chart } from '@antv/f2';
import { Panel, PanelItem } from 'weui-react-v2';
import styles from '../../index.css';
import { Select } from 'antd';
import Trend from '../Trend';
import ReportTabs from '../ReportTabs';

const Revenue = () => {

  useEffect(() => {
    const data = [{
      type: '未结算 669.47',
      cost: 669.47,
      a: '1',
    }, {
      type: '已结算 338',
      cost: 338,
      a: '1',
    }];

    let sum = 0;
    data.map(function(obj) {
      sum += obj.cost;
    });
    const chart = new Chart({
      id: 'myChart',
      pixelRatio: window.devicePixelRatio,
    });
    chart.source(data);
    chart.legend({
      position: 'bottom',
      offsetY: -5,
      marker: 'square',
      align: 'center',
    });
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.7,
      radius: 0.85,
    });
    chart.axis(false);
    chart.tooltip(false);
    chart.interval().position('a*cost').color('type', ['#1890FF', '#13C2C2']).adjust('stack');

    chart.guide().text({
      position: ['50%', '50%'],
      content: '合计:' + sum.toFixed(2) + '元',
      style: {
        fontSize: 14,
      },
    });
    chart.render();
  }, []);


  return (
    <>
      <Panel className={styles.title} title={
        <div>
          <Select
            bordered={false}
            defaultValue={['all']}
            options={[{ label: '全部', value: 'all' }]} />
          <Select
            bordered={false}
            defaultValue={['seven']}
            options={[{ label: '最近七天', value: 'seven' }]}
            style={{ float: 'right' }} />
        </div>
      }>
        <PanelItem title={<div>服务营收</div>}>
          <canvas id='myChart' style={{ backgroundColor: '#fff', width: '100%' }} height='260' />
        </PanelItem>
        <PanelItem title={<div>工单趋势</div>}>
          <Trend />
        </PanelItem>
      </Panel>
      <Panel className={styles.title} title={
        <div>
          <Select
            bordered={false}
            defaultValue={['all']}
            options={[{ label: '全部', value: 'all' }]} />
          <Select
            bordered={false}
            defaultValue={['seven']}
            options={[{ label: '最近七天', value: 'seven' }]}
            style={{ float: 'right' }} />
        </div>
      }>
        <ReportTabs />
      </Panel>
    </>
  );
};

export default Revenue;
