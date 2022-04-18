import { Skeleton } from 'weui-react-v2';
import React from 'react';
import { Collapse, List } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { Col, Row } from 'antd';
import { history } from 'umi';
import style from './index.css';


const Tark = () => {

  // const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();


  const { loading: messageLoading, data: messageData } = useRequest({
    url: '/message/list?limit=10', method: 'POST', data: {
      // createTime: date,
    },
  });

  const { data: number } = useRequest({ url: '/businessTrack/listNumber', method: 'POST' });

  if (messageLoading)
    return <Skeleton loading={messageLoading} />;

  if (!messageData || !number) {
    return <Skeleton loading />;
  }

  return (
    <div className={style.tark}>
      <Collapse defaultActiveKey={['0', '1', '2']} style={{ backgroundColor: '#fff', marginTop: 8 }}>
        <Collapse.Panel key='0' title='工作任务'>
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: 'rgba(82,72,72,0.82)' }}>{number.dailyNumber}</div>
              <div>日常</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: 'rgba(15,99,109,0.82)' }}>{number.businessNumber}</div>
              <div>项目</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: 'blue' }}>{number.contractNumber}</div>
              <div>合同</div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: 'red' }}>{number.timeout}</div>
              <div>已超时</div>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel key='1' title={`我的待办 (最近10条)`}>
          {
            messageData.filter((value) => {
              return value.state === 0;
            }).length > 0
              ?
              messageData.map((items, index) => {
                if (items.state === 0) {
                  const color = (~~(Math.random() * (1 << 24))).toString(16);
                  return (
                    <List.Item
                      onClick={() => {
                        switch (items.source) {
                          case 'instockOrder':
                          case 'instock':
                            history.push(`/Scan/InStock?id=${items.sourceId}`);
                            break;
                          case 'outstockOrder':
                            history.push(`/Scan/OutStock?id=${items.sourceId}`);
                            break;
                          case 'productionTask':
                            history.push(`/Work/ProductionTask/Detail?id=${items.sourceId}`);
                            break;
                          case 'selfPick':
                            history.push(`${items.url}`);
                            break;
                          case 'processTask':
                            history.push(`/Work/Workflow?id=${items.sourceId}`);
                            break;
                          default:
                            break;
                        }
                      }}
                      title={<>{items.title} <em style={{ fontSize: 12, color: '#c7c5c5' }}>{items.time}</em></>}
                      style={{ borderLeft: `#${color} 2px solid` }}
                      key={index}
                    >
                      {items.content}
                    </List.Item>
                  );
                } else {
                  return null;
                }
              }) : <>暂无代办</>
          }
        </Collapse.Panel>

        <Collapse.Panel key='2' title={`已完成待办 (最近10条)`}>
          {
            messageData.filter((value) => {
              return value.state === 1;
            }).length > 0
              ?
              messageData.map((items, index) => {
                if (items.state === 1) {
                  const color = (~~(Math.random() * (1 << 24))).toString(16);
                  return (
                    <List.Item
                      style={{ borderLeft: `#${color} 2px solid` }}
                      key={index}
                    >
                    </List.Item>
                  );
                } else {
                  return null;
                }
              }) : <>暂未完成</>
          }
        </Collapse.Panel>
      </Collapse>
    </div>

  );
};

export default Tark;
