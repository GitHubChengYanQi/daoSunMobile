import styles from './index.css';
import React, { useEffect } from 'react';
import {
  Button,
  Flex, FlexItem,
  List,
  ListItem,
  Preview,
  PreviewButton,
  PreviewItem,
  SafeArea,
  Search,
  WingBlank,
} from 'weui-react-v2';
import {SearchOutlined, ScanOutlined, CloseOutlined, PlusCircleOutlined, SolutionOutlined, UploadOutlined,
  DownloadOutlined, FileTextOutlined, TeamOutlined, FileProtectOutlined, DollarOutlined, DollarCircleOutlined,
  TransactionOutlined, RightOutlined} from '@ant-design/icons';
import { Affix, Badge, Calendar, Card, Col, Divider, Row, Switch } from 'antd';
import F2 from '@antv/f2';
import { router } from 'umi';
// import Canvas from '@antv/f2-canvas';
// import Avatar from 'antd/es/avatar/avatar';
// import ReactEcharts from 'echarts-for-react';


// function getOption(sales,stores) {
//   return {
//     title : {
//       text: '某站点用户访问来源',
//       subtext: '纯属虚构',
//       x:'center'
//     },
//     tooltip : {
//       trigger: 'item',
//       formatter: "{a} <br/>{b} : {c} ({d}%)"
//     },
//     legend: {
//       orient: 'vertical',
//       left: 'left',
//       data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
//     },
//     series : [
//       {
//         name: '访问来源',
//         type: 'pie',
//         radius : '55%',
//         center: ['50%', '60%'],
//         data:[
//           {value:335, name:'直接访问'},
//           {value:310, name:'邮件营销'},
//           {value:234, name:'联盟广告'},
//           {value:135, name:'视频广告'},
//           {value:1548, name:'搜索引擎'}
//         ],
//         itemStyle: {
//           emphasis: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)'
//           }
//         }
//       }
//     ]
//   }
// }

const Home = () =>{

  function onPanelChange(value, mode) {
    console.log(value.format('YYYY-MM-DD'), mode);
  }

useEffect(()=>{
  const data = [{
    name: '目标金额',
    percent: 83.59,
    a: '1'
  }, {
    name: '完成金额',
    percent: 32.17,
    a: '1'
  }];

  const map = {};
  data.map(function(obj) {
    map[obj.name] = obj.percent + '%';
  });

  const chart = new F2.Chart({
    id: 'myChart',
    pixelRatio: window.devicePixelRatio,
    padding: [20, 'auto']
  });
  chart.source(data, {
    percent: {
      formatter: function formatter(val) {
        return val + '%';
      }
    }
  });
  chart.tooltip(false);
  chart.legend({
    position: 'right',
    itemFormatter: function itemFormatter(val) {
      return val + '    ' + map[val];
    }
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.7,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval().position('a*percent').color('name', ['#3BA4FF', '#afabab']).adjust('stack');

  chart.guide().html({
    position: ['50%', '45%'],
    html: '<div style="width: 250px;height: 40px;text-align: center;">' + '<div style="font-size: 16px">完成度</div>' + '<div style="font-size: 24px">133.08 亿</div>' + '</div>'
  });
  chart.render();
});

  return (
    <>
      <WingBlank size="sm" >
        <Affix offsetTop={0}>
          <Search
            style={{paddingRight: '30%',float: 'left'}}
            placeholder="全局搜索关键字"
            onConfirm={(val) => console.log('确认输入: ', val)}
            onSearch={(val) => console.log('search: ', val)}
            onCancel={() => console.log('取消搜索')}
          >
          </Search>
        </Affix>
        <Calendar onPanelChange={onPanelChange} />
        <List >
          <ListItem style={{padding: 3, backgroundColor: '#E6E6E6'}} extra={<div style={{fontSize: 16}} >本月</div>} ><div style={{fontSize: 16}} >查看范围： 全公司</div></ListItem>
          <ListItem style={{padding: 5}} extra={<Switch defaultChecked={true}  />}><div style={{fontSize: 16}} >工作待办</div></ListItem>
          <Divider style={{margin: 15}}/>
          <div >
            <Row>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}} >待执行</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>进行中</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>已完成</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>已超时</div>
                </Badge>
              </Col>
            </Row>
          </div>
        </List>
        <List >
          <ListItem style={{padding: 3, backgroundColor: '#E6E6E6'}} extra={<div style={{fontSize: 16}} >本月</div>} ><div style={{fontSize: 16}} >查看范围： 自己</div></ListItem>
          <ListItem style={{padding: 10}} extra={<div style={{fontSize: 16}} onClick={()=>{router.push('/CompleteTrack');}}>详情 {<RightOutlined />}</div>} ><div style={{fontSize: 20}} >业绩目标</div></ListItem>
          <canvas id="myChart" style={{width: '100%', height: 260}}></canvas>
        </List>
        <Preview subTitle="销售简报"
        >
          <PreviewItem >
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><PlusCircleOutlined /></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>新建跟进记录</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 100%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><SolutionOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>合同订单个数</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >38</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 1167%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >3</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><SolutionOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>合同订单收款额</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 -100%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >0.00</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><UploadOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>出库单金额</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 100%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><FileTextOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>销售发票金额</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 100%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><DownloadOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>收款单金额</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >￥25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14, textAlign: 'left'}}>上月 100%</div><div style={{fontSize: 20,color: 'deepskyblue', textAlign: 'left'}} >￥3888.00</div></FlexItem>
            </Flex>
          </PreviewItem>
        </Preview>
        <Preview subTitle="合同简报"
        >
          <PreviewItem >
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><TeamOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >25个</div><div style={{fontSize: 14, textAlign: 'left'}}>新增客户数</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >26个</div><div style={{fontSize: 14, textAlign: 'left'}}>新增联系人数</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><FileProtectOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >25个</div><div style={{fontSize: 14, textAlign: 'left'}}>签约数量</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>签约金额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><TransactionOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}}>￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>已收入总额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>应收余额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><DollarCircleOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>已开票金额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>未开票金额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><DollarOutlined /></div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>已发货金额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 20, textAlign: 'left',color: 'deepskyblue'}} >￥00.00</div><div style={{fontSize: 14, textAlign: 'left'}}>未发货金额</div></FlexItem>
            </Flex>
          </PreviewItem>
        </Preview>
        <List >
          <ListItem style={{padding: 5}} extra={<Switch defaultChecked={true}  />}><div style={{fontSize: 16}} >售后简报</div></ListItem>
          <Divider style={{margin: 15}}/>
          <div style={{marginTop: 5}}>
            <Row>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}} >待执行</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>进行中</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>已完成</div>
                </Badge>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Badge count={99} overflowCount={10}>
                  <div style={{fontSize: 40}}>15</div><div style={{fontSize: 15}}>已超时</div>
                </Badge>
              </Col>
            </Row>
          </div>
        </List>
      </WingBlank>
  </>
  );
};

export default Home;
