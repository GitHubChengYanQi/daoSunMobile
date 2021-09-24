import styles from './index.css';
import React from 'react';
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
  Switch, WingBlank,
} from 'weui-react-v2';
import {SearchOutlined, ScanOutlined, CloseOutlined, PlusCircleOutlined, SolutionOutlined, UploadOutlined,
  DownloadOutlined, FileTextOutlined, TeamOutlined, FileProtectOutlined, DollarOutlined, DollarCircleOutlined,
  TransactionOutlined} from '@ant-design/icons';
import { Badge, Calendar, Card } from 'antd';
import F2 from '@antv/f2';
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

  //
  // const fontSize = 24 * (window.innerWidth / 375); // 字体适配不同屏幕
  //
  // const data = [{
  //   x: '1',
  //   y: 85
  // }];
  // const chart = new F2.Chart({
  //   id: 'mountNode',
  //   pixelRatio: window.devicePixelRatio
  // });
  // chart.source(data, {
  //   y: {
  //     max: 100,
  //     min: 0
  //   }
  // });
  // chart.axis(false);
  // chart.tooltip(false);
  // chart.coord('polar', {
  //   transposed: true,
  //   innerRadius: 0.8,
  //   radius: 0.85
  // });
  // chart.guide().arc({
  //   start: [0, 0],
  //   end: [1, 99.98],
  //   top: false,
  //   style: {
  //     lineWidth: 20,
  //     stroke: '#ccc'
  //   }
  // });
  // chart.guide().text({
  //   position: ['50%', '50%'],
  //   content: '85%',
  //   style: {
  //     fontSize: fontSize,
  //     fill: '#1890FF'
  //   }
  // });
  // chart.interval().position('x*y').size(20).animate({
  //   appear: {
  //     duration: 1200,
  //     easing: 'cubicIn'
  //   }
  // });
  // chart.render()


  return (
    <>
      <WingBlank size="md" className={styles.list}>
      <SafeArea style={{ margin: '-0.16rem', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>
          <Search
            // style={{width: '100%', paddingRight: '30%',float: 'left'}}

            placeholder="全局搜索关键字"
            onConfirm={(val) => console.log('确认输入: ', val)}
            onSearch={(val) => console.log('search: ', val)}
            onCancel={() => console.log('取消搜索')}
          >
          </Search>
      </SafeArea>
        {/*<div className="search" style={{ width: '100%'}}>*/}
        {/*  <Button icon={<CloseOutlined />} />*/}
        {/*  <Button icon={<ScanOutlined />} />*/}
        {/*  <Button icon={<SearchOutlined />} />*/}
        {/*</div>*/}
        <Calendar onPanelChange={onPanelChange} />
        <Preview subTitle="查看范围： 全公司" title="本月"
                 footer={[
                   <PreviewButton key="1">
                     <Badge count={99} overflowCount={10}>
                       <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}} >待执行</span>
                     </Badge>
                     </PreviewButton>,
                   <PreviewButton key="2">
                     <Badge count={99} overflowCount={10}>
                      <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>进行中</span>
                     </Badge>
                   </PreviewButton>,
                   <PreviewButton key="3">
                     <Badge count={99} overflowCount={10}>
                      <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已完成</span>
                     </Badge>
                   </PreviewButton>,
                   <PreviewButton key="4">
                     <Badge count={99} overflowCount={10}>
                      <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已超时</span>
                     </Badge>
                   </PreviewButton>,
                 ]}
        >
          <PreviewItem title="待办工作"><Switch defaultChecked={true} size="small" /></PreviewItem>
        </Preview>
        <Preview subTitle="查看范围： 自己" title="本月"
        >
          {/*<Canvas id="mountNode"></Canvas>*/}

        </Preview>
        <Preview subTitle="销售简报"
        >
          <PreviewItem >
            <Flex type="flex" justify="space-between">
              <FlexItem span={1}><div style={{textAlign: 'left'}}><PlusCircleOutlined /></div></FlexItem>
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
        <Preview
          footer={[
            <PreviewButton key="1">
              <Badge count={99} overflowCount={10}>
                <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}} >待执行</span>
              </Badge>
            </PreviewButton>,
            <PreviewButton key="2">
              <Badge count={99} overflowCount={10}>
                <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>进行中</span>
              </Badge>
            </PreviewButton>,
            <PreviewButton key="3">
              <Badge count={99} overflowCount={10}>
                <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已完成</span>
              </Badge>
            </PreviewButton>,
            <PreviewButton key="4">
              <Badge count={99} overflowCount={10}>
                <span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已超时</span>
              </Badge>
            </PreviewButton>,
          ]}
        >
          <PreviewItem title="售后简报"><Switch defaultChecked={true} size="small" /></PreviewItem>
        </Preview>


      </WingBlank>



  </>
  );
};

export default Home;
