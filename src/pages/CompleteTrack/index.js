import React, { useEffect } from 'react';
import F2 from '@antv/f2';

const CompleteTrack = () => {

  useEffect(()=> {
    const data = [{
      label: '2021-01',
      type: '完成金额',
      value: 2800
    }, {
      label: '2021-01',
      type: '目标金额',
      value: 2260
    }, {
      label: '2021-02',
      type: '完成金额',
      value: 1800
    }, {
      label: '2021-02',
      type: '目标金额',
      value: 1300
    }, {
      label: '2021-03',
      type: '完成金额',
      value: 950
    }, {
      label: '2021-03',
      type: '目标金额',
      value: 900
    }, {
      label: '2021-04',
      type: '完成金额',
      value: 500
    }, {
      label: '2021-04',
      type: '目标金额',
      value: 390
    }, {
      label: '2021-05',
      type: '完成金额',
      value: 170
    }, {
      label: '2021-06',
      type: '目标金额',
      value: 100
    }, {
      label: '2021-06',
      type: '完成金额',
      value: 100
    }, {
      label: '2021-07',
      type: '目标金额',
      value: 300
    }, {
      label: '2021-07',
      type: '完成金额',
      value: 800
    }, {
      label: '2021-08',
      type: '目标金额',
      value: 500
    }, {
      label: '2021-08',
      type: '完成金额',
      value: 1000
    }, {
      label: '2021-09',
      type: '目标金额',
      value: 500
    }, {
      label: '2021-09',
      type: '完成金额',
      value: 1000
    }, {
      label: '2021-10',
      type: '目标金额',
      value: 500
    }, {
      label: '2021-10',
      type: '完成金额',
      value: 1000
    }, {
      label: '2021-11',
      type: '目标金额',
      value: 500
    }, {
      label: '2021-11',
      type: '完成金额',
      value: 1000
    }];
    const chart = new F2.Chart({
      id: 'myChart',
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data.reverse(), {
      value: {
        tickInterval: 750
      }
    });
    chart.coord({
      transposed: true
    });

    chart.tooltip({
      custom: true, // 自定义 tooltip 内容框
      onChange: function onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};
        legendItems.map(function(item) {
          map[item.name] = item;
        });
        tooltipItems.map(function(item) {
          const name = item.name;
          const value = item.value;
          if (map[name]) {
            map[name].value = value;
          }
        });
        legend.setItems(map);
      },
      onHide: function onHide() {
        const legend = chart.get('legendController').legends.top[0];
        legend.setItems(chart.getLegendItems().country);
      }
    });
    chart.axis('label', {
      line: F2.Global._defaultAxis.line,
      grid: null
    });
    chart.axis('value', {
      line: null,
      grid: F2.Global._defaultAxis.grid,
      label: function label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.interval().position('label*value').color('type').adjust({
      type: 'dodge',
      marginRatio: 1 / 32
    });
    chart.render();
  });
  return(
    <>
      <canvas id="myChart" style={{width: '100%'}} ></canvas>
    </>
  );

};
export default CompleteTrack;
