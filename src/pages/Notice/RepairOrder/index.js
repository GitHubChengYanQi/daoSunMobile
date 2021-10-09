import React from 'react';
import { Affix, Badge, Select } from 'antd';
import { Card } from 'antd-mobile';
import { Button, PreviewItem, WhiteSpace } from 'weui-react-v2';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const RepairOrder = () => {


  return (
    <>
      <Affix offsetTop={0}>
        <Card style={{ backgroundColor: '#fff', padding: 0 }} title={
          <Select
            defaultValue='0'
            bordered={false}
            options={[{ label: '我负责的', value: '0' }, {
              label: '我负责的',
              value: '1',
            }, { label: '我负责的', value: '2' }]} />} extra={
          <>
            <Button type={'text'} icon={<SearchOutlined />} />
            <Button type={'text'} icon={<FilterOutlined />} />
          </>
        } />
      </Affix>
      <WhiteSpace />
      <Card
        title={
          <div>
            <div><Badge color='red' text='新的报修单' /></div>
            <div>您有一个新的保修单，请尽快处理！</div>
          </div>}
        extra={
          <>
            2021-12-01
          </>
        }>
        <PreviewItem title='创建人'>
          <div>张某某/17777777777</div>
        </PreviewItem>
        <PreviewItem title='工单来源'>
          <div>渠道公司</div>
        </PreviewItem>
        <PreviewItem title='工单类型'>
          <div>保外</div>
        </PreviewItem>
      </Card>
      <WhiteSpace />
      <Card
          title={
            <div>
              <div><Badge color='red' text='新的报修单' /></div>
              <div>您有一个新的保修单，请尽快处理！</div>
            </div>}
          extra={
            <>
              2021-12-01
            </>
          } >
          <PreviewItem title='创建人'>
            <div>张某某/17777777777</div>
          </PreviewItem>
          <PreviewItem title='工单来源'>
            <div>渠道公司</div>
          </PreviewItem>
          <PreviewItem title='工单类型'>
            <div>保外</div>
          </PreviewItem>
      </Card>
      <WhiteSpace />
      <Card
          title={
            <div>
              <div><Badge color='red' text='新的报修单' /></div>
              <div>您有一个新的保修单，请尽快处理！</div>
            </div>}
          extra={
            <>
              2021-12-01
            </>
          } >
          <PreviewItem title='创建人'>
            <div>张某某/17777777777</div>
          </PreviewItem>
          <PreviewItem title='工单来源'>
            <div>渠道公司</div>
          </PreviewItem>
          <PreviewItem title='工单类型'>
            <div>保外</div>
          </PreviewItem>
      </Card>
    </>
  );
};

export default RepairOrder;
