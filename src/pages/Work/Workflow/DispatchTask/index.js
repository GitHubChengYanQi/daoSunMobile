import React, {  useRef, useState } from 'react';
import { Button, Card, Checkbox, Dialog, Empty, List, SafeArea, Selector, Space, Toast } from 'antd-mobile';
import { request, useRequest } from '../../../../util/Request';
import { Col, Row } from 'antd';
import Dispatch from './components/Dispatch';
import style from './index.css';
import { qualityPlanListSelect, qualityTaskDetailEdit } from './components/URL';
import { useDebounceEffect } from 'ahooks';
import { CheckOutlined, CheckSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';


const DispatchTask = (props) => {

  const query = props.location.query;

  const [qualityTaskDetail, setQualityTaskDtail] = useState({});

  const [updateQualityPlan, setUpdateQualityPlan] = useState();

  const [visible, setVisible] = useState(false);

  const [check, setCheck] = useState([]);

  const ref = useRef();

  const { run: detail } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setQualityTaskDtail({ ...qualityTaskDetail, detail: res });
    },
  });

  const { data: qualityPlan } = useRequest(qualityPlanListSelect);

  const { run: update } = useRequest(qualityTaskDetailEdit,
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Toast.show(
          {
            content: '修改成功！',
          },
        );
      },
    });


  const { run: qualityLising, refresh } = useRequest({
    url: '/qualityTaskDetail/list',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setQualityTaskDtail({ ...qualityTaskDetail, qualityLising: res });
    },
  });

  const qualityTaskId = async (id) => {
    const data = await request({
      url: '/activitiProcessTask/detail',
      method: 'POST',
      data: {
        processTaskId: id,
      },
    });

    if (data && data.formId) {
      detail({
        data: {
          qualityTaskId: data.formId,
        },
      });

      qualityLising({
        data: {
          qualityTaskId: data.formId,
        },
      });
    }
  };


  useDebounceEffect(() => {
    qualityTaskId(query.id);
  }, [],{
    wait:0
  });

  return <>
    <Card title='质检任务分派' bodyStyle={{ padding: 0 }}>
      <Card title='基本信息' bodyStyle={{ padding: 0 }}>
        {qualityTaskDetail.detail ? <div>
          <List.Item>质检编码：{qualityTaskDetail.detail.coding}</List.Item>
          <List.Item>质检类型：{qualityTaskDetail.detail.type}</List.Item>
          <List.Item>负责人：{qualityTaskDetail.detail.userName || '无'}</List.Item>
          <List.Item>备注：{qualityTaskDetail.detail.remark || '无'}</List.Item>
          <List.Item>创建时间：{qualityTaskDetail.detail.createTime}</List.Item>
        </div> : <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description='暂无数据'
        />}
      </Card>
      <Card title='质检任务' bodyStyle={{ padding: 0 }}>
        {qualityTaskDetail.qualityLising && qualityTaskDetail.qualityLising.length > 0 ? <div>
            <Checkbox
              icon={(check)=>{
                if (!check){
                  return <PlusSquareOutlined />
                }else {
                  return <CheckSquareOutlined />
                }
              }}
              onChange={(value) => {
                if (value) {
                  const ids = qualityTaskDetail.qualityLising.filter((value) => {
                    return !value.userIds;
                  });
                  setCheck(ids);
                } else {
                  setCheck([]);
                }
              }}
              className={style.checkBox}
              style={{ width: '100%', padding: '8px 0' }}>
              <Row gutter={24}>
                <Col span={1} />
                <Col span={12} style={{ padding: 0 }}>
                  物料
                </Col>
                <Col span={6} style={{ padding: 0 }}>
                  供应商 / 品牌
                </Col>
                <Col span={4} style={{ padding: 0 }}>
                  质检方案
                </Col>
              </Row>
            </Checkbox>
            <Checkbox.Group
              value={check}
              onChange={(value) => {
                const plans = value.filter((items) => {
                  return !items.qualityPlanId;
                });
                if (plans.length > 0) {
                  Toast.show({
                    content: '请添加质检方案！',
                  });
                } else {
                  setCheck(value);
                }

              }}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                {qualityTaskDetail.qualityLising.map((items, index) => {
                  return <Checkbox
                    key={index}
                    icon={(check)=>{
                      if (!check){
                        return <PlusSquareOutlined />
                      }else {
                        return <CheckSquareOutlined />
                      }
                    }}
                    className={style.checkBox}
                    style={{ width: '100%' }}
                    disabled={items.userIds}
                    value={items}>
                    <Row gutter={24}>
                      <Col span={1} />
                      <Col span={12} style={{ padding: 0 }}>
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
                      <Col span={6} style={{ padding: 0 }}>
                        {items.brand && items.brand.brandName}
                        ×
                        {items.number}
                      </Col>
                      <Col span={4} style={{ padding: 0 }}>
                        <Button
                          color='primary'
                          fill='none'
                          disabled={items.userIds}
                          style={{ padding: 0 }}
                          onClick={() => {
                            setVisible(items);
                          }}>{items.qualityPlanResult ? items.qualityPlanResult.planName : '添加'}</Button>
                      </Col>
                    </Row>
                  </Checkbox>;

                })}
              </Space>
            </Checkbox.Group>
          </div>
          :
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无数据'
          />
        }
      </Card>
    </Card>;

    <div style={{
      width: '100%',
      paddingBottom: 0,
      position: 'fixed',
      bottom: 0,
      backgroundColor: '#fff',
    }}>
      <div style={{ padding: '0 8px' }}>
        <Button
          style={{
            padding: 8,
            width: '100%',
            backgroundColor: '#4B8BF5',
            borderRadius: 50,
          }}
          color='primary'
          disabled={check.length === 0}
          onClick={() => {
            ref.current.setVisiable(true);
          }}>
          分派
        </Button>
      </div>
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>


    <Dispatch
      qualityTaskId={qualityTaskDetail.detail && qualityTaskDetail.detail.qualityTaskId}
      qualityDetailIds={check.map((items) => {
      return items.qualityTaskDetailId;
    })} ref={ref} onSuccess={() => {
      refresh();
      setCheck([]);
      ref.current.setVisiable(false);
    }} />

    <Dialog
      title='修改质检方案'
      visible={visible}
      content={<Selector
        defaultValue={typeof visible === 'object' && visible.qualityPlanId}
        options={qualityPlan || []}
        columns={1}
        onChange={(arr, extend) => setUpdateQualityPlan(arr[0])}
      />
      }
      onAction={async (action) => {
        if (action.key === 'update') {
          await update({
            data: {
              qualityTaskDetailId: visible.qualityTaskDetailId,
              qualityPlanId: updateQualityPlan,
            },
          });
          setUpdateQualityPlan(null);
          setVisible(false);
          setCheck([]);
        } else {
          setVisible(false);
          setUpdateQualityPlan(null);
        }
      }}
      actions={[
        [{
          key: 'update',
          text: '修改',
          disabled: !updateQualityPlan,
        },
          {
            key: 'close',
            text: '取消',
          }],
      ]}
    />

  </>;

};

export default DispatchTask;
