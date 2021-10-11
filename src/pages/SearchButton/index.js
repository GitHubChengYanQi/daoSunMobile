import { Affix } from 'antd';
import { List,
  ListItem,  WhiteSpace,
} from 'weui-react-v2';
import { Grid, Search } from 'antd-mobile';
import { ClockCircleOutlined, RightOutlined} from '@ant-design/icons';
import { router } from 'umi';
import React from 'react';

const SearchButton = () =>{
  const data = Array.from(new Array(8)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
  }));

  return(
    <>
      <Affix >
        <Search placeholder="全局搜索关键字" maxLength={8} />
      </Affix>
      <WhiteSpace size="lg" />
      <div>
        <div style={{textAlign: 'center', fontSize: 20, color: "#666666"}}>按照指定类型搜索</div>
        <WhiteSpace size="lg" />
        <Grid data={data} activeStyle={false} />
      </div>
      <List title="搜素历史">
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>

        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
        <ListItem thumb={<ClockCircleOutlined style={{ fontSize: '4vw' }} />} extra={<div style={{fontSize: 20}} onClick={()=>{router.push('/CompleteTrack');}}> {<RightOutlined />}</div>}>
          搜素关键词
        </ListItem>
      </List>

    </>
  );
};
export default SearchButton;
