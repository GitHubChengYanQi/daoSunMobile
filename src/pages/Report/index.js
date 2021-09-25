import React, { useEffect, useState } from 'react';
import { List, ListItem, Panel, PanelItem, SafeArea, SegmentedControl, WingBlank } from 'weui-react-v2';
import styles from './index.css';
import { Chart } from '@antv/f2';

const Report = () => {

  const [page, setPage] = useState('gsyy');

  const data = [
    {
      label: '公司运营',
      value: 'gsyy',
    },
    {
      label: '售后统计',
      value: 'shtj',
    },
    {
      label: '库存统计',
      value: 'kctj',
    },
  ];

  const report = () => {
    switch (page) {
      case 'gsyy':
        return (
          <List className={styles.title} title={<div>售后运营</div>}>
            <ListItem style={{ padding: 8 }} access extra={<>
              <div style={{ fontSize: 8 }}>昨日服务客户</div>
              <div style={{ fontSize: 8 }}>80</div>
            </>}>
              <div style={{ width: '80%' }}>
                <div style={{ display: 'inline-block' }}>服务工单</div>
                <div style={{ float: 'right', fontWeight: 900, color: '#416e91' }}>1158</div>
              </div>
            </ListItem>
            <ListItem style={{ padding: 8 }} access extra={<>
              <div style={{ fontSize: 8 }}>进行中的工单</div>
              <div style={{ fontSize: 8 }}>90</div>
            </>}>
              <div style={{ width: '80%' }}>
                <div style={{ display: 'inline-block' }}>未完成工单</div>
                <div style={{ float: 'right', fontWeight: 900, color: '#416e91' }}>58</div>
              </div>
            </ListItem>
            <ListItem style={{ padding: 8 }} access extra={<>
              <div style={{ fontSize: 8 }}>昨日完成工单</div>
              <div style={{ fontSize: 8 }}>65</div>
            </>}>
              <div style={{ width: '80%' }}>
                <div style={{ display: 'inline-block' }}>今日完成工单</div>
                <div style={{ float: 'right', fontWeight: 900, color: '#416e91' }}>66</div>
              </div>
            </ListItem>
            <ListItem style={{ padding: 8 }} access extra={<>
              <div style={{ fontSize: 8 }}>昨日赢收</div>
              <div style={{ fontSize: 8 }}>￥59999</div>
            </>}>
              <div style={{ width: '80%' }}>
                <div style={{ display: 'inline-block' }}>今日赢收</div>
                <div style={{ float: 'right', fontWeight: 900, color: '#416e91' }}>￥49999</div>
              </div>
            </ListItem>
            <ListItem style={{ padding: 8 }} access extra={<>
              <div style={{ fontSize: 8 }}>近30天差评率</div>
              <div style={{ fontSize: 8 }}>0.01%</div>
            </>}>
              <div style={{ width: '80%' }}>
                <div style={{ display: 'inline-block' }}>近30天好评率</div>
                <div style={{ float: 'right', fontWeight: 900, color: '#416e91' }}>99.99%</div>
              </div>
            </ListItem>
          </List>
        );
      case 'kctj':
        console.log('2');
        return;
    }
  };


  useEffect(() => {
    var data = [{
      type: '未结算 669.47',
      cost: 669.47,
      a: '1',
    }, {
      type: '已结算 338',
      cost: 338,
      a: '1',
    }];

    var sum = 0;
    data.map(function(obj) {
      sum += obj.cost;
    });
    var chart = new Chart({
      id: 'myChart',
      pixelRatio: window.devicePixelRatio,
    });
    chart.source(data);
    var lastClickedShape;
    chart.legend({
      position: 'bottom',
      offsetY: -5,
      marker: 'square',
      align: 'center',
      onClick: function onClick(ev) {
        var clickedItem = ev.clickedItem;
        var dataValue = clickedItem.get('dataValue');
        var canvas = chart.get('canvas');
        var coord = chart.get('coord');
        var geom = chart.get('geoms')[0];
        var container = geom.get('container');
        var shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性

        var clickedShape;

        if (lastClickedShape) {
          lastClickedShape.animate().to({
            attrs: {
              lineWidth: 0,
            },
            duration: 200,
          }).onStart(function() {
            if (lastClickedShape.label) {
              lastClickedShape.label.hide();
            }
          }).onEnd(function() {
            lastClickedShape.set('selected', false);
          });
        }

        if (clickedShape.get('selected')) {
          clickedShape.animate().to({
            attrs: {
              lineWidth: 0,
            },
            duration: 200,
          }).onStart(function() {
            if (clickedShape.label) {
              clickedShape.label.hide();
            }
          }).onEnd(function() {
            clickedShape.set('selected', false);
          });
        } else {
          var color = clickedShape.attr('fill');
          clickedShape.animate().to({
            attrs: {
              lineWidth: 5,
            },
            duration: 350,
            easing: 'bounceOut',
          }).onStart(function() {
            clickedShape.attr('stroke', color);
            clickedShape.set('zIndex', 1);
            container.sort();
          }).onEnd(function() {
            clickedShape.set('selected', true);
            clickedShape.set('zIndex', 0);
            container.sort();
            lastClickedShape = clickedShape;
            if (clickedShape.label) {
              clickedShape.label.show();
            } else {
            }
            canvas.draw();
          });
        }
      },
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
    <SafeArea style={{ margin: '-0.16rem', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>
      <WingBlank size='sm'>
        <SegmentedControl
          value={page}
          data={data}
          style={{ backgroundColor: '#fff' }}
          onChange={(val) => setPage(val)} />
        {report()}
        <Panel className={styles.title} title={<div>全部</div>}>
          <PanelItem style={{padding:16}} title={<div>服务营收</div>}>
            <canvas id='myChart' style={{ backgroundColor: '#fff', width: '100%' }} height='260' />
          </PanelItem>
        </Panel>
      </WingBlank>
    </SafeArea>
  );
};

export default Report;
