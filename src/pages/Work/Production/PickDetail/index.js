import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail } from '../components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Badge, Button, Card, List, Space, Tabs } from 'antd-mobile';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import Label from '../../../components/Label';
import styles from '../index.css';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import { getHeader } from '../../../components/GetHeader';
import BottomButton from '../../../components/BottomButton';
import ReportWork from '../../ProductionTask/Detail/components/ReportWork';
import Icon from '../../../components/Icon';
import { Col, Row } from 'antd';
import { history } from 'umi';

const PickDetail = (props) => {

  const params = props.location.query;

  const [visible, setVisible] = useState();

  const { loading, data, run, refresh } = useRequest(productionTaskDetail, { manual: true });

  const [key, setKey] = useState('out');

  useEffect(() => {
    if (params.id) {
      run({ data: { productionTaskId: params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const status = (state) => {
    switch (state) {
      case 0:
        return <Space style={{ color: '#ffa52a' }}><QuestionCircleOutline />待领取</Space>;
      case 98:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
      case 99:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return '';
    }
  };

  const backgroundDom = () => {

    return <Card
      title={<div><Label>领料单号：</Label>{'无'}</div>}
      style={{ backgroundColor: '#fff' }}>
      <Space direction='vertical'>
        <div>
          <Label>任务状态：</Label>{status(data.status)}
        </div>
        <div>
          <Label>任务编码：</Label>{data.productionTaskResult && data.productionTaskResult.coding}
        </div>
        <div>
          <Label>领料人：</Label>{data.userResult && data.userResult.name}
        </div>
        <div>
          <Label>创建时间：</Label>{data.createTime}
        </div>
      </Space>
    </Card>;
  };

  return <div>
    <MyNavBar title='任务详情' />
    <div>
      <MyFloatingPanel
        maxHeight={window.innerHeight - (getHeader() ? 52 : 97)}
        backgroundDom={backgroundDom()}
      >
        <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999, textAlign: 'center' }}>
          库位
        </div>
        <div style={{ backgroundColor: '#eee' }}>
          <div style={{ margin: 8 }}>
            <Card style={{borderRadius:0}}>
              <Row gutter={24}>
                <Col span={18}>
                  物料
                </Col>
                <Col span={6}>
                  × 数量
                </Col>
              </Row>

            </Card>
            <div>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomLeftRadius: 10,
                }}
              >
                备料
              </Button>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomRightRadius: 10,
                }}
              >
                出库
              </Button>
          </div>
          </div>
          <div style={{ margin: 8 }}>
            <Card style={{borderRadius:0}}>
              <Row gutter={24}>
                <Col span={18}>
                  物料
                </Col>
                <Col span={6}>
                  × 数量
                </Col>
              </Row>

            </Card>
            <div>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomLeftRadius: 10,
                }}
              >
                备料
              </Button>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomRightRadius: 10,
                }}
              >
                出库
              </Button>
            </div>
          </div>
          <div style={{ margin: 8 }}>
            <Card style={{borderRadius:0}}>
              <Row gutter={24}>
                <Col span={18}>
                  物料
                </Col>
                <Col span={6}>
                  × 数量
                </Col>
              </Row>

            </Card>
            <div>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomLeftRadius: 10,
                }}
              >
                备料
              </Button>
              <Button
                onClick={() => {

                }}
                style={{
                  width: '50%',
                  color: 'var(--adm-color-primary)',
                  '--border-radius': '0px',
                  borderBottomRightRadius: 10,
                }}
              >
                出库
              </Button>
            </div>
          </div>
        </div>
      </MyFloatingPanel>
    </div>

    <BottomButton
      leftText={<Badge content='5'><Space style={{margin:'0 16px'}}><Icon type='icon-gouwuchekong' />备料</Space></Badge>}
      rightText={<Space><Icon type='icon-chuku' />出库</Space>}
    />

  </div>;
};
export default PickDetail;
