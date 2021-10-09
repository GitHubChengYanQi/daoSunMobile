import React from 'react';
import { Affix, Badge, Select } from 'antd';
import { Card } from 'antd-mobile';
import { Button, PreviewItem, WhiteSpace } from 'weui-react-v2';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const RepairOrder = () => {


  return (
    <>
      <Affix offsetTop={0}>
        <Card style={{backgroundColor: '#fff' , padding: 0 }} title={
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
            <div>备件申领办理通知</div>}
          extra={
            <>
              2021-12-01 15:00：99
            </>
          } >
          <PreviewItem title="申请人"><div>张某某</div></PreviewItem>
          <PreviewItem title="备件名称"><div>xxxxx</div></PreviewItem>
          <PreviewItem title="备件去向"><div>未知</div></PreviewItem>
      </Card>
      <WhiteSpace />
      <Card
          title={
            <div>备件申领办理通知</div>}
          extra={
            <>
              2021-12-01 15:00：99
            </>
          } >
          <PreviewItem title="申请人"><div>张某某</div></PreviewItem>
          <PreviewItem title="备件名称"><div>xxxxx</div></PreviewItem>
          <PreviewItem title="备件去向"><div>未知</div></PreviewItem>
      </Card>
      <WhiteSpace />
      <Card
          title={
            <div>备件申领办理通知</div>}
          extra={
            <>
              2021-12-01 15:00：99
            </>
          } >
          <PreviewItem title="申请人"><div>张某某</div></PreviewItem>
          <PreviewItem title="备件名称"><div>xxxxx</div></PreviewItem>
          <PreviewItem title="备件去向"><div>未知</div></PreviewItem>
      </Card>
    </>
  );
};

export default RepairOrder;
