import React, { useState } from 'react';
import { Button, Card, Collapse, Empty, List } from 'antd-mobile';
import { Col, Row } from 'antd';
import { router } from 'umi';
import { useRequest } from '../../../../util/Request';
import { useDebounceEffect } from 'ahooks';
import Detail from '../../Quality/Detail';

const QualityDetails = (props) => {

  const query = props.location.query;

  const [qualityTaskDetail, setQualityTaskDtail] = useState({});

  const { run: detail } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setQualityTaskDtail({ ...qualityTaskDetail, detail: res });
    },
  });

  const { run: qualityLising } = useRequest({
    url: '/qualityTaskDetail/list',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setQualityTaskDtail({ ...qualityTaskDetail, qualityLising: res });
    },
  });


  useDebounceEffect(() => {
    if (query.qualityTaskId) {
      detail({
        data: {
          qualityTaskId: query.qualityTaskId,
        },
      });

      qualityLising({
        data: {
          qualityTaskId: query.qualityTaskId,
        },
      });
    }
  }, [], {
    wait: 0,
  });

  return <Card title='质检任务信息' extra={<Button style={{ padding: 0 }} color='primary' fill='none' onClick={() => {
    router.goBack();
  }}>返回审批页面</Button>}>
    <Collapse defaultActiveKey={['0', '1', '2']}>
      <Collapse.Panel key='0' title='基本信息'>
        {qualityTaskDetail.detail ? <div>
          <List.Item>质检编码：{qualityTaskDetail.detail.coding}</List.Item>
          <List.Item>质检类型：{qualityTaskDetail.detail.type}</List.Item>
          <List.Item>负责人：{qualityTaskDetail.detail.userName}</List.Item>
          <List.Item>备注：{qualityTaskDetail.detail.remark || '无'}</List.Item>
          <List.Item>创建时间：{qualityTaskDetail.detail.createTime}</List.Item>
        </div> : <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description='暂无数据'
        />}
      </Collapse.Panel>
      <Collapse.Panel key='1' title='质检任务'>
        {qualityTaskDetail.qualityLising && qualityTaskDetail.qualityLising.length > 0 ? <div>
            <List.Item>
              <Row gutter={24}>
                <Col span={14} style={{ padding: 0, textAlign: 'center' }}>
                  物料+供应商 / 品牌
                </Col>
                <Col span={2} style={{ padding: 0 }} />
                <Col span={8} style={{ padding: 0 }}>
                  质检方案
                </Col>
              </Row>
            </List.Item>
            {qualityTaskDetail.qualityLising.map((items, index) => {
              if (items.number > 0) {
                return <List.Item key={index}>
                  <Row gutter={24}>
                    <Col span={14}>
                      {items.skuResult && items.skuResult.skuName}
                      &nbsp;/&nbsp;
                      {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
                      <br />
                      <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                        (
                        {
                          items.skuResult
                          &&
                          items.skuResult.skuJsons
                          &&
                          items.skuResult.skuJsons.map((items, index) => {
                            return (
                              <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
                            );
                          })
                        }
                        )
                      </em>
                    </Col>
                    <Col span={2} style={{ padding: 0 }}>
                      × {items.number}
                    </Col>
                    <Col span={8} style={{ padding: 0 }}>
                      {items.qualityPlanResult && items.qualityPlanResult.planName}
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={10}>
                      {items.brand && items.brand.brandName}
                    </Col>
                    <Col span={14}>
                      {items.userIds && ('质检人:' + (items.users && items.users.toString()))}
                    </Col>
                  </Row>
                </List.Item>;
              } else {
                return null;
              }

            })}
          </div>
          :
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无数据'
          />
        }
      </Collapse.Panel>
      <Collapse.Panel key='2' title='质检详情'>
        <Detail qualityTaskId={query.qualityTaskId} />
      </Collapse.Panel>
    </Collapse>
  </Card>;
};

export default QualityDetails;
