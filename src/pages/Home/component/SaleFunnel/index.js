import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';
import { ListItem } from 'weui-react-v2';
import { router } from 'umi';
import { RightOutlined } from '@ant-design/icons';
import DataSet from '@antv/data-set';

const SaleFunnel =() =>{
  const { DataView } = DataSet;

  useEffect(()=>{
    const dv = new DataView().source([
      { action: '初步洽谈', pv: 50000 },
      { action: '深入沟通', pv: 35000 },
      { action: '产品报价', pv: 25000 },
      { action: '成交商机', pv: 15000 },
      { action: '流失商机', pv: 8000 },
    ]);
    dv.transform({
      type: 'map',
      callback(row) {
        row.percent = row.pv / 50000;
        return row;
      },
    });
    const data = dv.rows;
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: [20, 120, 95],
    });
    chart.data(data);
    chart.axis(false);
    chart.tooltip({
      showTitle: false,
      showMarkers: false,
      itemTpl:
        '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
        '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
        '{name}<br/>' +
        '<span style="padding-left: 16px;line-height: 16px;">浏览人数：{pv}</span><br/>' +
        '<span style="padding-left: 16px;line-height: 16px;">占比：{percent}</span><br/>' +
        '</li>',
    });
    chart
      .coordinate('rect')
      .transpose()
      .scale(1, -1);
    chart
      .interval()
      .adjust('symmetric')
      .position('action*percent')
      .shape('funnel')
      .color('action', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'])
      .label(
        'action*pv',
        (action, pv) => {
          return {
            content: `${action} ${pv}`,
          };
        },
        {
          offset: 35,
          labelLine: {
            style: {
              lineWidth: 1,
              stroke: 'rgba(0, 0, 0, 0.15)',
            },
          },
        }
      )
      .tooltip('action*pv*percent', (action, pv, percent) => {
        return {
          name: action,
          percent: +percent * 100 + '%',
          pv,
        };
      })
      .animate({
        appear: {
          animation: 'fade-in'
        },
        update: {
          annotation: 'fade-in'
        }
      });

    chart.interaction('element-active');

    chart.on('beforepaint', () => {
      chart.annotation().clear(true);
      const chartData = chart.getData();
      // 中间标签文本
      chartData.forEach((obj) => {
        chart.annotation().text({
          top: true,
          position: {
            action: obj.action,
            percent: 'median',
          },
          content: +obj.percent * 100 + '%', // 显示的文本内容
          style: {
            stroke: null,
            fill: '#fff',
            textAlign: 'center',
          },
        });
      });
    });

    chart.render();
  });
  return(
    <>
      <div>
        <ListItem style={{padding: 10}} extra={<div style={{fontSize: 16}} onClick={()=>{router.push('/CompleteTrack');}}>详情 {<RightOutlined />}</div>} ><div style={{fontSize: 20}} >销售漏斗</div></ListItem>
        <div id="container" style={{width: '100%', height: 500}} ></div>
      </div>
    </>
  );
};
export default SaleFunnel;
