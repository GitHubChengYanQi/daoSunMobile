import { Affix, Col, Row } from 'antd';
import { history } from 'umi';
import { Button, Search } from 'weui-react-v2';
import React, { useState } from 'react';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import DataList from './DataList';
import { Popup } from 'antd-mobile';
import Screening from '../DataManage/Screening';

const DataManage = () => {
  const [select, setSelect] = useState();

  const [screening, setScreening] = useState();
  return (
    <div>
      <Affix offsetTop={0}>
      <Row gutter={24} style={{ backgroundColor: '#fff' }}>

        <Col span={4} >
          <Button type='link' style={{ padding: 14 }} icon={<PlusOutlined />} onClick={() => {
            history.push('/Work/DataManage/DataAdd');
          }} />
        </Col>

        <Col span={16} >
          <Search
          style={{
            backgroundColor: '#fff',
            border: 'solid 1px #eee',
            padding: '0 10px',
            margin: 8,
            borderRadius: 10,
          }}
          placeholder='资料名称'
          maxLength={8}
          onConfirm={(value)=>{
            setSelect({name:value})
          }}
          />
        </Col>

        <Col span={4}>
          <Button type='link' style={{ padding: 14 }} icon={<FilterOutlined />}  onClick={() => {
            setScreening(true);
          }} />

          <Popup
            visible={screening}
            onMaskClick={() => {
              setScreening(false);
            }}
            position='right'
            bodyStyle={{ minWidth: '70vw' }}
          >
            <Screening select={(value) => {
              setScreening(false);
              setSelect(value);
            }} />
          </Popup>
        </Col>
      </Row>
      </Affix>
      <DataList select={select} />


    </div>
  );
};
export default DataManage;
