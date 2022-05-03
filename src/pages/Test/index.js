import React from 'react';
import { Card, Space } from 'antd-mobile';
import Label from '../components/Label';
import MyFloatingPanel from '../components/MyFloatingPanel';

const Test = () => {


  return <>

    <div>

      <Card title={<div>基本信息</div>}>
        <Space direction='vertical'>
          <div>
            <Label>Label：</Label>value
          </div>
          <div>
            <Label>Label：</Label>value
          </div>
          <div>
            <Label>Label：</Label>value
          </div>
          <div>
            <Label>Label：</Label>value
          </div>
          <div>
            <Label>Label：</Label>value
          </div>
          <div>
            <Label>Label：</Label>value
          </div>
        </Space>
      </Card>

      <div style={{borderTop:'1px solid #eee',transform: 'translate3d(0px, 0px, 0px)'}}>
        <div style={{textAlign:'center',padding:24,backgroundColor:'#fff'}}>
          拖动区域
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>

    </div>

    {/*<MyFloatingPanel backgroundDom={ <Card title={<div>基本信息</div>}>*/}
    {/*  <Space direction='vertical'>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*    <div>*/}
    {/*      <Label>Label：</Label>value*/}
    {/*    </div>*/}
    {/*  </Space>*/}
    {/*</Card>}>*/}
    {/*  123*/}
    {/*</MyFloatingPanel>*/}



  </>
};

export default Test;
