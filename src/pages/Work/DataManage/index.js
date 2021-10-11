import { Col, Row } from 'antd';
import { Button } from 'antd-mobile';
import { router } from 'umi';
import { Search } from 'weui-react-v2';
import React from 'react';

const DataManage = () => {
  return (
    <div>
      <Row gutter={24} style={{ backgroundColor: '#fff' }}>
        <Col span={4} >
          <Button color='primary' style={{ paddingTop: 15 }} fill='none' onClick={()=>{
            router.push('/Work/DataManage/DataAdd');
          }}>
          </Button>
        </Col>
        <Col span={16} >
          <Search
          style={{
            backgroundColor: '#fff',
            border: 'solid 1px #eee',
            padding: '0 8px',
            margin: 8,
            borderRadius: 100,
          }}
          placeholder='搜索产品'
          maxLength={8}
          // onConfirm={(value) => {
          //   setSelect({ customerName: value });
          // }}
          />
        </Col>

        <Col span={4}></Col>
      </Row>
    </div>
  );
};
export default DataManage;
