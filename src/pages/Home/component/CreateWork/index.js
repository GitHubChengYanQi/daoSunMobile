import React from 'react';
import { Flex, Grid } from 'antd-mobile';
import { ShakeOutlined, CarryOutOutlined, CloudOutlined } from '@ant-design/icons';
import { Button, ListItem } from 'weui-react-v2';
import { router } from 'umi';
import { Col, Row } from 'antd';


const CreateWork = () => {
  const data = Array.from(
    [{icon:<CarryOutOutlined style={{fontSize: 30, color: 'rgba(37,203,79,0.39)'}}/>, text: "安排日程"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "安排任务"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "办公申请"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "发布动态"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "写新跟进"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "工作报告"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "考勤打卡"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "外勤签到"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "新建线索"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}}/>, text: "新建客户"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "新建联系人"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "新建商机"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}}/>, text: "新建订单"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "新建回款"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}} />, text: "新建报销"}
    ,{icon:<CarryOutOutlined style={{fontSize: 30}}/>, text: "上传文档"}]).map((val, i) => ({
    icon: val.icon,
    text: val.text,
  }));
  console.log(111111111111 ,data);
  const data1 = new Date();
  const time = data1.getFullYear()+ "年" + (data1.getMonth() + 1) + "月" + data1.getDate();
  let xq = "";
  switch (data1.getDay()) {
    case 0 :
      xq = "星期日";
      break;
    case 1:
      xq = "星期一";
      break;
    case 2:
      xq = "星期二";
      break;
    case 3:
      xq = "星期三";
      break;
    case 4:
      xq = "星期四";
      break;
    case 5:
      xq = "星期五";
      break;
    case 6:
      xq = "星期六";
      break;
  }
  return(
    <>
      <Row style={{backgroundColor: 'white', margin: 5 }}>
        <Col span={12}>
          <div style={{color:'#1f77af',height: 30, fontSize: 25, marginLeft: 10}}>{time}</div>
          <div style={{color:'#1f77af',height: 30, fontSize: 20, marginLeft: 10}}>{xq}</div>
        </Col>
        <Col span={2}>
          <CloudOutlined style={{fontSize: 30, color: '#33782a'}} />
        </Col>
        <Col span={10}>
          <div style={{color:'#1f77af',height: 30, marginLeft: 10}}>上海</div>
          <div style={{color:'#1f77af',height: 30, marginLeft: 10}}>阵雨/22℃</div>
        </Col>
      </Row>

      <Grid data={data} activeStyle={false} />
    </>
  );
};
export default CreateWork;
