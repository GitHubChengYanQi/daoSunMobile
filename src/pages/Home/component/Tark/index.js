import { Skeleton, WhiteSpace } from 'weui-react-v2';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Button, Collapse, Dialog, Image, List } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { Col, Row } from 'antd';


const Tark = () => {

  const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

  const { run } = useRequest(
    {
      url: '/businessTrack/edit',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        successRefresh();
      },
    });

  const { data ,refresh } = useRequest({ url: '/businessTrack/list', method: 'POST', data: { timeLike: date, state: 0 } });

  const { data: success,refresh:successRefresh } = useRequest({
    url: '/businessTrack/list',
    method: 'POST',
    data: { timeLike: date, state: 1 },
  });


  const { data: number } = useRequest({ url: '/businessTrack/listNumber', method: 'POST' });

  if (!data || !number || !success) {
    return <Skeleton loading />;
  }

  return (
    <>
      <Collapse defaultActiveKey={['0', '1', '2']} style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Collapse.Panel key='0' title='工作任务'>
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize:24,color: 'rgba(82,72,72,0.82)' }}>{number.dailyNumber}</div>
              <div>日常</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize:24, color: 'rgba(15,99,109,0.82)' }}>{number.businessNumber}</div>
              <div>项目</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize:24, color: 'blue' }}>{number.contractNumber}</div>
              <div>合同</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize:24, color: 'red' }}>{number.timeout}</div>
              <div>已超时</div>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel key='1' title={`今日代办 (${data.length})`}>
          {
            data.length ? data.map((items, index) => {
              const color = (~~(Math.random() * (1 << 24))).toString(16);
              const timeOut = new Date(items.time) < new Date();
              return (
                <List.Item
                  style={{ borderLeft: `#${color} 2px solid` }}
                  key={index}
                  extra={
                    <>
                      <div>{items.type}</div>
                      <Button
                        color={timeOut ? 'danger' : 'primary'}
                        disabled={timeOut} fill='none'
                        style={{ padding: '8px 0' }}
                        onClick={() => {
                          Dialog.show({
                            content:
                              <List.Item
                                key={index}
                                title={items && items.userResult ? items.userResult.name : '--'} wrap align='top'>
                                <WhiteSpace size={'sm'} />
                                分类:{items.categoryName}
                                <WhiteSpace size={'sm'} />
                                跟进类型:{items.type}
                                <WhiteSpace size={'sm'} />
                                {items.image && <>图片: <Image src={items.image} width={100} /></>}
                                <WhiteSpace size={'sm'} />
                                跟进内容:{items.note}
                                <WhiteSpace size={'sm'} />
                                提醒内容:{items.message}
                                <WhiteSpace size={'sm'} />
                                创建时间:{items.createTime}
                              </List.Item>,
                            closeOnAction: true,
                            onAction: (action) => {
                              if (action.key === 'success') {
                                run({
                                  data: {
                                    trackId: items.trackId,
                                    state: 1,
                                  },
                                });
                              }
                            },
                            actions: [
                              [
                                {
                                  key: 'cancel',
                                  text: '取消',
                                },
                                {
                                  key: 'success',
                                  text: '完成',
                                },
                              ],
                            ],
                          });
                        }}>{timeOut ? <div><ExclamationCircleOutlined />&nbsp;已超时</div> :
                        <div><RightCircleOutlined />&nbsp;执行中</div>}</Button>
                    </>
                  }
                  title={items.userResult && items.userResult.name}
                  description={<><ClockCircleOutlined />&nbsp;&nbsp;{items.time}</>}>
                  <div style={{ color: '#000' }}>{items.note}</div>
                </List.Item>
              );
            }) : <>暂无代办</>
          }
        </Collapse.Panel>

        <Collapse.Panel key='2' title={`今日完成 (${success.length})`}>
          {
            success.length ? success.map((items, index) => {
              const color = (~~(Math.random() * (1 << 24))).toString(16);
              return (
                <List.Item
                  style={{ borderLeft: `#${color} 2px solid` }}
                  key={index}
                  extra={
                    <>
                      <div>{items.type}</div>
                      <Button color={'success'} fill='none' style={{ padding: '8px 0' }}>
                        <CheckCircleOutlined />&nbsp;已完成
                      </Button>
                    </>
                  }
                  title={items.userResult && items.userResult.name}
                  description={<><ClockCircleOutlined />&nbsp;&nbsp;{items.time}</>}>
                  <div style={{ color: '#000' }}>{items.note}</div>
                </List.Item>
              );
            }) : <>暂未完成</>
          }
        </Collapse.Panel>
      </Collapse>
    </>

  );
};

export default Tark;
