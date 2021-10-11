import React, { useEffect } from 'react';
import { Card, Radio, Col, Row } from 'antd';
import { List, ListItem, PanelItem } from 'weui-react-v2';
import { Chart } from '@antv/f2/lib/index-all';
import Trend from '../Trend';
import Top from '../Top';

const Stock = () => {


  useEffect(() => {
    var data = [{
      amount: 20,
      ratio: 0.1,
      memo: '借出',
      const: 'const'
    }, {
      amount: 100,
      ratio: 0.5,
      memo: '出售',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '盘亏',
      const: 'const'
    }, {
      amount: 30,
      ratio: 0.15,
      memo: '调出',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '分配倒库',
      const: 'const'
    }, {
      amount: 20,
      ratio: 0.1,
      memo: '调拨出库',
      const: 'const'
    }, {
      amount: 10,
      ratio: 0.05,
      memo: '申领到个人',
      const: 'const'
    }];

    const chart = new Chart({
      id: 'myChart',
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.75
    });
    chart.axis(false);
    chart.legend({
      position: 'bottom',
      align: 'center'
    });
    chart.tooltip(false);
    chart.guide().html({
      position: ['50%', '50%'],
      html: '<div style="width: 100px;height: 20px;text-align: center;line-height: 20px;" id="textContent"></div>'
    });
    // 配置文本饼图
    chart.pieLabel({
      sidePadding: 75,
      label1: function label1(data) {
        return {
          text: data.memo,
          fill: '#808080'
        };
      },
      label2: function label2(data) {
        return {
          fill: '#000000',
          text: data.amount.toFixed(2),
          fontWeight: 500,
          fontSize: 10
        };
      }
    });
    chart.interval().position('const*ratio').color('memo', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273']).adjust('stack');
    chart.render();

    // 绘制内阴影
    var frontPlot = chart.get('frontPlot');
    var coord = chart.get('coord'); // 获取坐标系对象
    frontPlot.addShape('sector', {
      attrs: {
        x: coord.center.x,
        y: coord.center.y,
        r: coord.circleRadius * coord.innerRadius * 1.2, // 全半径
        r0: coord.circleRadius * coord.innerRadius,
        fill: '#000',
        opacity: 0.15
      }
    });
    chart.get('canvas').draw();
  }, []);

  return (
    <>
      <List>
        <Card title='库存简报' bordered={false} bodyStyle={{ padding: '8px 16px' }}>
          <Row gutter={24}>
            <Col span={12} style={{ padding: 8 }}>
              <div style={{ textAlign: 'center', backgroundColor: '#eee', borderRadius: 20, padding: 16 }}>
                <strong>￥65000</strong><br />库存总额
              </div>
            </Col>
            <Col span={12} style={{ padding: 8 }}>
              <div style={{ textAlign: 'center', backgroundColor: '#eee', borderRadius: 20, padding: 16 }}>
                <strong>3</strong><br />备件品类
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12} style={{ padding: 8 }}>
              <div style={{ textAlign: 'center', backgroundColor: '#eee', borderRadius: 20, padding: 16 }}><strong
                style={{ color: 'red' }}>0</strong><br />低库存预警
              </div>
            </Col>
            <Col span={12} style={{ padding: 8 }}>
              <div style={{ textAlign: 'center', backgroundColor: '#eee', borderRadius: 20, padding: 16 }}>
                <strong>0</strong><br />无库存
              </div>
            </Col>
          </Row>
        </Card>
      </List>
      <List>
        <ListItem style={{padding:16}} extra={<div>查看详情</div>} arrow={true}>
          <Radio.Group defaultValue='a' buttonStyle='solid'>
            <Radio.Button value='a'>出库</Radio.Button>
            <Radio.Button value='b'>入库</Radio.Button>
          </Radio.Group>
        </ListItem>
        <canvas id='myChart' style={{ backgroundColor: '#fff', width: '100%' }} height='260' />
        <PanelItem style={{ padding: 16 }} title={<div>工单趋势</div>}>
          <Trend />
        </PanelItem>
        <PanelItem style={{ padding: 16 }} title={<div>备件使用TOP榜</div>}>
          <Top />
        </PanelItem>
      </List>
    </>
  );
};

export default Stock;
