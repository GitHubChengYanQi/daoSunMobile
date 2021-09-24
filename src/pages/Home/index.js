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
  Switch,
} from 'weui-react-v2';
import {SearchOutlined, ScanOutlined, CloseOutlined, PlusCircleOutlined, SolutionOutlined, UploadOutlined, DownloadOutlined, FileTextOutlined} from '@ant-design/icons';
import { Calendar, Card } from 'antd';
import F2 from '@antv/f2';
// import ReactEcharts from 'echarts-for-react';

function onPanelChange(value, mode) {
  console.log(value.format('YYYY-MM-DD'), mode);
}
function getOption(sales,stores) {
  return {
    title : {
      text: '某站点用户访问来源',
      subtext: '纯属虚构',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value:335, name:'直接访问'},
          {value:310, name:'邮件营销'},
          {value:234, name:'联盟广告'},
          {value:135, name:'视频广告'},
          {value:1548, name:'搜索引擎'}
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}


export default function() {
  return (
    <>
      <div>
      <SafeArea style={{ margin: '-0.16rem', minHeight: '10', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>

          <Search
            // style={{width: '100%', paddingRight: '30%',float: 'left'}}
            placeholder="全局搜索关键字"
            onConfirm={(val) => console.log('确认输入: ', val)}
            onSearch={(val) => console.log('search: ', val)}
            onCancel={() => console.log('取消搜索')}
          >
          </Search>
        {/*<div className="search" style={{ width: '100%'}}>*/}
        {/*  <Button icon={<CloseOutlined />} />*/}
        {/*  <Button icon={<ScanOutlined />} />*/}
        {/*  <Button icon={<SearchOutlined />} />*/}
        {/*</div>*/}
        <div >
          <Calendar onPanelChange={onPanelChange} />
        </div>

        <Preview subTitle="查看范围： 全公司" title="本月"
                 footer={[
                   <PreviewButton key="1"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}} >待执行</span></PreviewButton>,
                   <PreviewButton key="2"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>进行中</span>
                   </PreviewButton>,
                   <PreviewButton key="3"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已完成</span>
                   </PreviewButton>,
                   <PreviewButton key="4"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已超时</span>
                   </PreviewButton>,
                 ]}
        >
          <PreviewItem title="待办工作"><Switch defaultChecked={true} size="small" /></PreviewItem>
        </Preview>
        <List style={{backgroundColor: '#E6E6E6'}} title={<><div style={{marginTop: 0}}><div style={{ display: 'inline'}}>查看范围： 自己</div>
          <div style={{marginLeft: '71%', display: 'inline'}}>本月</div></div></>}>
          <ListItem extra={ <Switch defaultChecked={true} size="small" />} >待办工作</ListItem>
          <ListItem extra="说明文字">
            <Card>
              {/*<ReactEcharts option={getOption()} />*/}
            </Card>
          </ListItem>
        </List>

        <Preview subTitle="销售简报"
        >
          <PreviewItem >
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>新建跟进记录</div><div style={{fontSize: 15}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 100%</div><div style={{fontSize: 15}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<SolutionOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>合同订单个数</div><div style={{fontSize: 15}} >38</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 1167%</div><div style={{fontSize: 15}} >3</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<SolutionOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>合同订单收款额</div><div style={{fontSize: 15}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 -100%</div><div style={{fontSize: 15}} >0.00</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<UploadOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>出库单金额</div><div style={{fontSize: 15}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 100%</div><div style={{fontSize: 15}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<FileTextOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>销售发票金额</div><div style={{fontSize: 15}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 100%</div><div style={{fontSize: 15}} >0</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<DownloadOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>收款单金额</div><div style={{fontSize: 15}} >25</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 14}}>上月 100%</div><div style={{fontSize: 15}} >0</div></FlexItem>
            </Flex>
          </PreviewItem>
        </Preview>
        <Preview subTitle="合同简报"
        >
          <PreviewItem >
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >25个</div><div style={{fontSize: 14}}>新增客户数</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >0个</div><div style={{fontSize: 14}}>新增联系人数</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >25个</div><div style={{fontSize: 14}}>签约数量</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >0个</div><div style={{fontSize: 14}}>签约金额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >25个</div><div style={{fontSize: 14}}>已收入总额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >0个</div><div style={{fontSize: 14}}>应收余额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >25个</div><div style={{fontSize: 14}}>已开票金额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >0个</div><div style={{fontSize: 14}}>未开票金额</div></FlexItem>
            </Flex>
            <Flex type="flex" justify="space-between">
              <FlexItem span={4}>{<PlusCircleOutlined />}</FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >25个</div><div style={{fontSize: 14}}>已发货金额</div></FlexItem>
              <FlexItem span={8}><div style={{fontSize: 15}} >0个</div><div style={{fontSize: 14}}>未发货金额</div></FlexItem>
            </Flex>
          </PreviewItem>
        </Preview>
        <Preview
                 footer={[
                   <PreviewButton key="1"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}} >待执行</span></PreviewButton>,
                   <PreviewButton key="2"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>进行中</span>
                   </PreviewButton>,
                   <PreviewButton key="3"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已完成</span>
                   </PreviewButton>,
                   <PreviewButton key="4"><span style={{fontSize: 50}}>15</span><span style={{fontSize: 20}}>已超时</span>
                   </PreviewButton>,
                 ]}
        >
          <PreviewItem title="售后简报"><Switch defaultChecked={true} size="small" /></PreviewItem>
        </Preview>
      </SafeArea>

      </div>




  </>
  );
}
