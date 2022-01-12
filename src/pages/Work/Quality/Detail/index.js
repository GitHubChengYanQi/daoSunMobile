import React, { useState } from 'react';
import { Button, Card, Collapse, Ellipsis, Empty,  Space } from 'antd-mobile';
import { Badge, Col, Row } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Gallery } from 'weui-react-v2';
import { useRequest } from '../../../../util/Request';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import { useDebounceEffect } from 'ahooks';
import SkuResult from '../../../Scan/Sku/components/SkuResult';


const Detail = (props) => {

  const state = props.location.state;

  const qualityDetail = state && state.qualityDetails;

  const [visible, setVisible] = useState();

  const { data, run } = useRequest({
    url: '/qualityTask/getDetail',
    method: 'POST',
  }, { manual: true });

  useDebounceEffect(() => {
    if (qualityDetail && qualityDetail.inkindId) {
      run({
        data: {
          qrcodeIds: state.qualityDetails.inkindId.split(','),
        },
      });
    }
  }, [], {
    wait: 0,
  });

  const operator = (operator, value) => {
    switch (operator) {
      case 1:
        return <>{'=' + value}</>;
      case 2:
        return <>{'>=' + value}</>;
      case 3:
        return <>{'<=' + value}</>;
      case 4:
        return <>{'>' + value}</>;
      case 5:
        return <>{'<' + value}</>;
      case 6:
        return <>{value.split(',')[0] + '  —  ' + value.split(',')[1]}</>;
      default:
        break;
    }
  };

  const Type = (items) => {
    if (items) {
      switch (items.qualityCheckResult && items.qualityCheckResult.type) {
        case 1:
          return <>{operator(items.operator, items.standardValue)} </>;
        case 2:
          return <>文本</>;
        case 3:
          return <>是否</>;
        case 4:
          return <>{operator(items.operator, items.standardValue)} % </>;
        case 5:
          return <>附件</>;
        default:
          return null;
      }
    }
  };

  const valueType = (type, value) => {
    switch (type) {
      case 1:
        return <>{value}</>;
      case 2:
        return <>{value}</>;
      case 3:
        return <>{(value !== '0') ? '合格' : '不合格'}</>;
      case 4:
        return <>{value} % </>;
      case 5:
        return value &&
          <Button
            style={{ padding: 0 }}
            color='primary'
            fill='none'
            onClick={() => setVisible([value])}><EyeOutlined /></Button>;
      default:
        return null;
    }
  };

  if (!(qualityDetail && data)) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  return <Card title='质检详情' extra={<LinkButton title='返回' onClick={() => {
    history.push(`/Work/Quality?id=${qualityDetail.qualityTaskId}`);
  }} />}>
    {data.length > 0 ? <Collapse accordion>
        {
          data.map((items, index) => {
            const standar = items.values && items.values.filter((value) => {
              return value.dataValues.judge === 0;
            });
            return <Collapse.Panel key={index} title={
              <Space align='center'>
                <div style={{width:'70vw'}}>
                  <SkuResult skuResult={qualityDetail.skuResult} />
                  <br />
                  {qualityDetail.brand && qualityDetail.brand.brandName}
                </div>
                <div>{(standar && standar.length > 0)
                  ?
                  <Badge text='不合格' color='red' />
                  :
                  <Badge text='合格' color='green' />}</div>
              </Space>
            }>
              <Row key={index} gutter={24}>
                <Col span={4} style={{ padding: 0 }}>
                  <strong>质检项</strong>
                </Col>
                <Col span={7} style={{ padding: 0 }}>
                  <strong>标准值</strong>
                </Col>
                <Col span={6} style={{ padding: 0 }}>
                  <strong>验收值</strong>
                </Col>
                <Col span={2} style={{ padding: 0, textAlign: 'center' }}>
                  <strong>图片</strong>
                </Col>
                <Col span={3} style={{ padding: 0, textAlign: 'center' }}>
                  <strong>结果</strong>
                </Col>
              </Row>
              {items.values && items.values.map((items, index) => {
                return <Row key={index} gutter={24}>
                  <Col span={4} style={{ padding: 0 }}>
                    <Ellipsis
                      direction='end'
                      content={
                        items.qualityPlanDetailResult
                        &&
                        items.qualityPlanDetailResult.qualityCheckResult
                        &&
                        items.qualityPlanDetailResult.qualityCheckResult.name
                      }
                    />
                  </Col>
                  <Col span={7} style={{ padding: 0 }}>
                    {Type(items.qualityPlanDetailResult)}
                  </Col>
                  <Col span={6} style={{ padding: 0 }}>
                    {valueType(
                      items.qualityPlanDetailResult
                      &&
                      items.qualityPlanDetailResult.qualityCheckResult
                      &&
                      items.qualityPlanDetailResult.qualityCheckResult.type,
                      items.dataValues && items.dataValues.value,
                    )}
                  </Col>
                  <Col span={2} style={{ padding: 0, textAlign: 'center' }}>
                    {
                      items
                      &&
                      items.dataValues
                      &&
                      items.dataValues.imgValues
                      &&
                      items.dataValues.imgValues.length > 0
                      &&
                      <Button
                        style={{ padding: 0 }}
                        color='primary'
                        fill='none'
                        onClick={() => {
                          setVisible(items.dataValues.imgValues);
                        }}><EyeOutlined /></Button>}
                  </Col>
                  <Col span={3} style={{ padding: 0, textAlign: 'center' }}>
                    {items.dataValues && items.dataValues.judge !== 0 ?
                      <CheckCircleOutlined style={{ color: 'green' }} />
                      :
                      <CloseCircleOutlined style={{ color: 'red' }} />}
                  </Col>
                </Row>;
              })}
            </Collapse.Panel>;
          })
        }

      </Collapse>
      :
      <Empty
        style={{ padding: '64px 0' }}
        imageStyle={{ width: 128 }}
        description='暂无数据'
      />
    }
    <Gallery className='image-view-demo' data={visible ? visible.map((items) => {
      return {
        src: items.url,
      };
    }) : []} visible={visible} onVisibleChange={setVisible} />
  </Card>;

};

export default Detail;
