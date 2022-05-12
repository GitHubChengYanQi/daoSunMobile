import React, { useState } from 'react';
import MyEmpty from '../components/MyEmpty';
import { Affix, Table } from 'antd';
import { SegmentedControl } from 'weui-react-v2';
import Stock from './components/Stock';
import Revenue from './components/Revenue';

// const { Column } = Table;

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
          <Table showHeader={false} pagination={false} dataSource={[
            {
              key: '1',
              title: '服务工单',
              value: <div style={{ fontWeight: 900, color: '#416e91' }}>1158</div>,
              extra: <>
                <div>昨日服务客户</div>
                <div>1158</div>
              </>,
            },
            {
              key: '2',
              title: '未完成工单',
              value: <div style={{ fontWeight: 900, color: '#416e91' }}>58</div>,
              extra: <>
                <div>进行中的工单</div>
                <div>90</div>
              </>,
            },
            {
              key: '3',
              title: '今日完成工单',
              value: <div style={{ fontWeight: 900, color: '#416e91' }}> 11</div>,
              extra: <>
                <div>昨日完成工单</div>
                <div>65</div>
              </>,
            },
            {
              key: '4',
              title: '今日赢收',
              value: <div style={{ fontWeight: 900, color: '#416e91' }}>￥49999</div>,
              extra: <>
                <div>昨日赢收</div>
                <div>￥59999</div>
              </>,
            },
            {
              key: '5',
              title: '近30天好评率',
              value: <div style={{ fontWeight: 900, color: '#416e91' }}>99.99%</div>,
              extra: <>
                <div>近30天差评率</div>
                <div>0.01%</div>
              </>,
            },
          ]}>
            <Table.Column dataIndex='title' />
            <Table.Column dataIndex='value' align='right' />
            <Table.Column dataIndex='extra' align='right' />
          </Table>
        );
      case 'shtj':
        return (
          <Revenue />
        );
      case 'kctj':
        return (
          <Stock />
        );
      default:
        break;
    }
  };

  return (<MyEmpty />)


  return (

    <>
        <Affix offsetTop={0}>
          <SegmentedControl
            value={page}
            data={data}
            style={{ backgroundColor: '#fff' }}
            onChange={(val) => setPage(val)} />
        </Affix>
        {report()}
    </>
  );
};

export default Report;
