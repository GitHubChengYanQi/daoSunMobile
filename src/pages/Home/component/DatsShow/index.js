import React, { useEffect } from 'react';
import { Chart } from '@antv/f2';

const DataShow = () => {

  useEffect(() => {
    const data = [{
      type: '',
      cost: 7256.36,
      a: '1',
    }, {
      type: '库存总额 ￥3536.66',
      cost: 3536.66,
      a: '1',
    }, {
      type: '固定资产 ￥5000.00',
      cost: 5000.00,
      a: '1',
    }, {
      type: '应付欠款 ￥8565.78',
      cost: 8565.78,
      a: '1',
    }];

    let sum = 0;
    data.map((obj) => {
      return sum += obj.cost;
    });
    const chart = new Chart({
      id: 'myChart',
    });
    chart.source(data);
    chart.legend({
      position: 'left',
      align:'center',
      verticalAlign:'top',
      itemGap:0,
      offsetX:-300,
      custom:true,
    });
    chart.coord('polar', {
      transposed: true,
      radius: 0.85,
    });
    chart.axis(false);
    chart.tooltip(false);
    chart.interval().position('a*cost').color('type',
      [
        '#F04864',
        '#1890FF',
        '#13C2C2',
        '#FACC14',
      ],
    ).adjust('stack');
    chart.render();
  }, []);


  return (
    <>
      <canvas id='myChart' height={200} style={{margin:'-35px',marginRight:'-50%'}}/>
    </>
  );
};

export default DataShow;
