import React, { useEffect } from 'react';
import { Chart } from '@antv/f2';

const Top = () => {

  useEffect(()=>{
    var data = [{
      year: '内存卡',
      sales: 38
    }, {
      year: '备件 a',
      sales: 52
    }, {
      year: '洗手台',
      sales: 61
    }, {
      year: '螺丝帽',
      sales: 145
    }, {
      year: '纽扣',
      sales: 48
    }];
    var chart = new Chart({
      id: 'TopChart',
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data, {
      sales: {
        tickCount: 5
      }
    });
    chart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = '¥ ' + items[0].value;
      }
    });
    chart.interval().position('year*sales');
    chart.render();
  },[])

  return (
      <canvas id='TopChart' style={{ backgroundColor: '#fff', width: '100%' }} height='260' />
  );
};

export default Top;
