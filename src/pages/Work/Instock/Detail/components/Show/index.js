import React from 'react';
import { Button, Card, Divider, Space, Tabs } from 'antd-mobile';
import { Avatar } from 'antd';
import styles from '../../../../Production/index.css';
import { DownFill } from 'antd-mobile-icons';
import Label from '../../../../../components/Label';
import MyEllipsis from '../../../../../components/MyEllipsis';
import { useBoolean } from 'ahooks';

const Show = (
  {
    data,
    type,
    setKey,
    typeKey,
  }) => {

  const [state, { toggle }] = useBoolean();

  const source = (value) => {
    switch (value) {
      case 'procurementOrder':
        return '采购单';
      default:
        return '请选择';
    }
  };

  const logResult = data
    &&
    data.logResults
    &&
    data.logResults[data.logResults.length - 1] || {};

  const logUser = logResult.createUserResult || {};

  const backgroundDom = () => {

    return <div style={{ backgroundColor: '#f9f9f9' }}>
      <Card
        title={<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar shape='square' size={56}>入</Avatar>
          <div style={{ marginLeft: 16 }}>
            <div>
              入库单 / {data.coding}
            </div>
            <Space>
              {data.urgent ?
                <Button color='danger' style={{ '--border-radius': '50px', padding: '4px 24px' }}>加急</Button> : null}
              {data.statusResult && <Button
                color='default'
                fill='outline'
                style={{
                  '--border-radius': '50px',
                  padding: '4px 12px',
                  '--background-color': '#fff7e6',
                  '--text-color': '#fca916',
                  '--border-width': '0px',
                }}>{data.statusResult.name || '-'}</Button>}
            </Space>
          </div>
        </div>}
        bodyStyle={{ padding: 0 }}
        className={styles.mainDiv}
        style={{ backgroundColor: '#f9f9f9', border: 'solid 1px rgb(206 200 200)', paddingBottom: 8 }}
        extra={<div style={{ paddingRight: 16 }} onClick={() => {
          toggle();
        }}><DownFill /></div>}
      >
        {!state && <Card
          style={{ backgroundColor: '#f9f9f9' }}
          title={<div>基本信息</div>}
          bodyStyle={{ padding: '0 16px' }}
          headerStyle={{ border: 'none' }}
        >
          <Space style={{ width: '100%' }} direction='vertical'>
            <Space>
              <Label>入库主题：</Label><MyEllipsis width='50vw'>{data.theme}</MyEllipsis>
            </Space>
            <div>
              <Label>入库类型：</Label>{data.type}
            </div>
            <div>
              <Label>送料人员：</Label>{data.userResult && data.userResult.name}
            </div>
            <div>
              <Label>送料时间：</Label>{data.registerTime}
            </div>
            <div>
              <Label>库管人员：</Label>{data.stockUserResult && data.stockUserResult.name}
            </div>
            <Divider style={{ margin: 0 }} />
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <Space direction='vertical' align='center'>
                  <Label>入库物料</Label>{data.enoughNumber}
                </Space>
              </div>
              <div style={{ flexGrow: 1, color: 'green' }}>
                <Space direction='vertical' align='center'>
                  已入库{data.notNumber}
                </Space>
              </div>
              <div style={{ flexGrow: 1, color: 'red' }}>
                <Space direction='vertical' align='center'>
                  未入库{data.realNumber}
                </Space>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <div>
              <Label>申请人：</Label>{data.createUserResult && data.createUserResult.name}
            </div>
            <div>
              <Label>申请时间：</Label>{data.createTime}
            </div>
            <div>
              <Label>更新人员：</Label>{data.updateUserResult && data.updateUserResult.name}
            </div>
            <div>
              <Label>更新时间：</Label>{data.updateTime}
            </div>
            <div>
              <Label>关联任务：</Label>{source(data.source)}
            </div>
            <div>
              <Label>备注说明：</Label>{data.remake}
            </div>
          </Space>
        </Card>}
      </Card>
      <Card
        title={<div>入库信息</div>}
        style={{ backgroundColor: '#f9f9f9' }}
        bodyStyle={{ padding: 8, backgroundColor: '#fff', border: 'solid 1px rgb(206 200 200)', borderRadius: 10 }}
        headerStyle={{ border: 'none' }}
      >
        {logUser.name ? <Space style={{ width: '100%' }} direction='vertical'>
            <div style={{ display: 'flex' }}>
              <Label>库管人员：</Label>
              <MyEllipsis width='60%'>{logUser.name} / {logUser.roleName} / {logUser.deptName}</MyEllipsis>
            </div>
            <div>
              <Label>入库时间：</Label>{logResult.instockTime}
            </div>
            <div>
              <Label>库管意见：</Label>{logResult.remark}
            </div>
          </Space>
          :
          <div>暂无</div>
        }
      </Card>
    </div>;
  };

  return <>
    <div>
      <div>
        {backgroundDom()}
        <Tabs
          activeKey={typeKey}
          style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999, marginTop: 18 }}
          onChange={(key) => {
            setKey(key);
          }}
        >
          <Tabs.Tab title={<div>入库明细</div>} key='detail' />
          <Tabs.Tab title={<div>入库记录</div>} key='record' />
          <Tabs.Tab title={<div>动态日志</div>} key='log' />
        </Tabs>
        <div style={{ backgroundColor: '#eee' }}>
          {type}
        </div>
      </div>
    </div>

  </>;
};

export default Show;
