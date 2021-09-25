import React, { useEffect } from 'react';
import { Chart } from '@antv/f2';

const Trend = () => {

  useEffect(() => {
    var data = [{
      day: '2021-9-1',
      value: 23,
      type: '新增',
    }, {
      day: '2021-9-2',
      value: 12,
      type: '新增',
    }, {
      day: '2021-9-1',
      value: 4,
      type: '完成',
    }, {
      day: '2021-9-2',
      value: 23,
      type: '完成',
    },{
      day: '2021-9-3',
      value: 56,
      type: '新增',
    }, {
      day: '2021-9-4',
      value: 23,
      type: '新增',
    }, {
      day: '2021-9-3',
      value: 65,
      type: '完成',
    }, {
      day: '2021-9-4',
      value: 22,
      type: '完成',
    }];
    var chart = new Chart({
      id: 'trend',
      pixelRatio: window.devicePixelRatio,
    });
    chart.source(data, {
      day: {
        range: [0, 1],
      },
      value: {
        tickCount: 5,
        min: 0,
      },
    });
    chart.axis('time', {
      line: null,
      label: function label(text, index, total) {
        var textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      },
    });
    chart.axis('day', {
      label: function label(text, index, total) {
        var textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.legend({
      position: 'bottom',
      offsetY: -5,
    });
    chart.line().position('day*value').color('type').shape('type', function(type) {
      if (type === '新增') {
        return 'line';
      }
      if (type === '完成') {
        return 'line';
      }
    });

    chart.render();
  }, []);

  return (
    <canvas id='trend' style={{ backgroundColor: '#fff', width: '100%' }} height='260' />
  );
};

export default Trend;
