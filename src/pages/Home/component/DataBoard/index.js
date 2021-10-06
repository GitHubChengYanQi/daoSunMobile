import { Flex, FlexItem, ListItem, Preview, PreviewItem, WhiteSpace } from 'weui-react-v2';
import { Badge, Col, Divider, Row, Space, Switch, Table, Tag } from 'antd';
import { router } from 'umi';
import {
  DollarCircleOutlined, DollarOutlined,
  DownloadOutlined, FileProtectOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  RightOutlined,
  SolutionOutlined, TeamOutlined, TransactionOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { Chart } from '@antv/f2';
import DealRank from '@/pages/Home/component/DealRank';
import SaleFunnel from '@/pages/Home/component/SaleFunnel';
import { Card } from 'antd-mobile';

const DataBoard = () => {


  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: text => <a>{text}</a>,
    },
    {
      title: '商机数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '预计销售金额',
      dataIndex: 'salePrice',
      key: 'salePrice',
    },
  ];

  const data = [
    {
      key: '1',
      time: '2021-01',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['nice', 'developer'],
    },
    {
      key: '2',
      time: '2021-02',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['loser'],
    },
    {
      key: '3',
      time: '2021-03',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '4',
      time: '2021-04',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '5',
      time: '2021-05',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '6',
      time: '2021-06',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '7',
      time: '2021-07',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '8',
      time: '2021-08',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '9',
      time: '2021-09',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '10',
      time: '2021-10',
      quantity: 1000,
      salePrice: '￥1,000,000.00',
      // tags: ['cool', 'teacher'],
    },
  ];

  useEffect(() => {
    const data1 = [{
      name: '目标金额',
      percent: 83.59,
      a: '1',
    }, {
      name: '完成金额',
      percent: 32.17,
      a: '1',
    }];

    const map = {};
    data1.map(function(obj) {
      map[obj.name] = obj.percent + '%';
    });

    const chart = new Chart({
      id: 'myChart',
      pixelRatio: window.devicePixelRatio,
      padding: [20, 'auto'],
    });
    chart.source(data1, {
      percent: {
        formatter: function formatter(val) {
          return val + '%';
        },
      },
    });
    chart.tooltip(false);
    chart.legend({
      position: 'right',
      itemFormatter: function itemFormatter(val) {
        return val + '    ' + map[val];
      },
    });
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.7,
      radius: 0.85,
    });
    chart.axis(false);
    chart.interval().position('a*percent').color('name', ['#3BA4FF', '#afabab']).adjust('stack');

    chart.guide().html({
      position: ['50%', '45%'],
      html: '<div style="width: 250px;height: 40px;text-align: center;">' + '<div style="font-size: 16px">完成度</div>' + '<div style="font-size: 24px">133.08 亿</div>' + '</div>',
    });
    chart.render();
  });

  return (
    <>
      <div>
        <ListItem extra={<div style={{ fontSize: 14 }} onClick={() => {
          router.push('/CompleteTrack');
        }}>详情 {<RightOutlined />}</div>}>业绩目标</ListItem>

        <canvas id='myChart' style={{ width: '100%', height: 260 }} />

        <Card
          style={{ marginTop: 30 }}
          title='销售简报'
        >
          <div>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><PlusCircleOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>新建跟进记录</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>25</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 100%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>0</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><SolutionOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>合同订单个数</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>38</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 1167%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>3</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><SolutionOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>合同订单收款额</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥25.00</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 -100%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥00.00</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><UploadOutlined style={{ fontSize: '6vw' }} /></div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>出库单金额</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥25.00</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 100%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥00.00</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><FileTextOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>销售发票金额</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥25.00</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 100%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥00.00</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><DownloadOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>收款单金额</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥25.00</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 14, textAlign: 'left' }}>上月 100%</div>
                <div style={{ fontSize: 20, color: 'deepskyblue', textAlign: 'left' }}>￥3888.00</div>
              </FlexItem>
            </Flex>
          </div>
        </Card>
        <WhiteSpace size='xs' />
        <Card title='合同简报'>
          <div>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><TeamOutlined style={{ fontSize: '6vw' }} /></div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>25个</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>新增客户数</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>26个</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>新增联系人数</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><FileProtectOutlined
                  style={{ fontSize: '6vw' }} /></div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>25个</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>签约数量</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>签约金额</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><TransactionOutlined
                  style={{ fontSize: '6vw' }} /></div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>已收入总额</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>应收余额</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><DollarCircleOutlined
                  style={{ fontSize: '6vw' }} /></div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>已开票金额</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>未开票金额</div>
              </FlexItem>
            </Flex>
            <Flex type='flex' justify='space-between'>
              <FlexItem span={3}>
                <div style={{ marginTop: 20, textAlign: 'center' }}><DollarOutlined style={{ fontSize: '6vw' }} />
                </div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>已发货金额</div>
              </FlexItem>
              <FlexItem span={8}>
                <div style={{ fontSize: 20, textAlign: 'left', color: 'deepskyblue' }}>￥00.00</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>未发货金额</div>
              </FlexItem>
            </Flex>
          </div>
        </Card>
        <WhiteSpace size='xs' />
        <Card
          title='成交排行'
          extra={<div onClick={() => {
            router.push('/CompleteTrack');
          }}>详情 {<RightOutlined />}</div>}
        >
          <div>
            <DealRank />
          </div>
        </Card>
        <WhiteSpace size='xs' />
        <Card
          title='销售漏斗'
          extra={<div onClick={() => {
            router.push('/CompleteTrack');
          }}>详情 {<RightOutlined />}</div>}
        >
          <div>
            <SaleFunnel />
          </div>
        </Card>
        <WhiteSpace size='xs' />
        <Card
          title='销售预测'
          extra={<div onClick={() => {
            router.push('/CompleteTrack');
          }}>详情 {<RightOutlined />}</div>}
        >
          <div>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
        </Card>
      </div>
    </>
  );

};
export default DataBoard;
