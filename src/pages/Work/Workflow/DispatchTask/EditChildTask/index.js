import React, { useRef, useState } from 'react';
import { Button, Card, Dialog, Divider, Empty, SafeArea, Selector, Stepper, Toast } from 'antd-mobile';
import LinkButton from '../../../../components/LinkButton';
import { router } from 'umi';
import { Col, Row } from 'antd';
import { useRequest } from '../../../../../util/Request';
import { qualityPlanListSelect, qualityTaskDetailEdit } from '../components/URL';
import Dispatch from '../components/Dispatch';

const EditChildTask = (props) => {

  const locationState = props.location.state;

  const [detail, setDetail] = useState(
    locationState
    &&
    {
      ...locationState.detail,
      qualityLising: locationState.detail.qualityLising.map((items) => {
        return { ...items, newNumber: items.remaining };
      }),
    });

  const ref = useRef();

  const [updateQualityPlan, setUpdateQualityPlan] = useState();

  const [visible, setVisible] = useState(false);

  const { data: qualityPlan } = useRequest(qualityPlanListSelect);

  const { run: update } = useRequest(qualityTaskDetailEdit,
    {
      manual: true,
      onSuccess: () => {
        Toast.show(
          {
            content: '修改成功！',
          },
        );
      },
    });

  if (!detail) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  return <>
    <Card title='编辑任务分派' extra={<LinkButton title='返回' onClick={() => {
      router.push(`/Work/Workflow/DispatchTask?id=${locationState.taskId}`);
    }} />}>
      {detail.qualityLising ? detail.qualityLising.map((items, index) => {
          return <div key={index}>
            <div>
              {items.skuResult && items.skuResult.skuName}
              &nbsp;/&nbsp;
              {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
              &nbsp;&nbsp;
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
            </div>
            <Row gutter={24}>
              <Col span={17}>
                {items.brand && items.brand.brandName}
              </Col>
              <Col span={7}>
                <Stepper
                  digits={0}
                  min={1}
                  max={items.remaining}
                  defaultValue={items.remaining}
                  onChange={value => {
                    detail.qualityLising[index] = { ...detail.qualityLising[index], newNumber: value };
                  }}
                />
              </Col>
            </Row>
            <div>
              <Button
                color='primary'
                fill='none'
                disabled={items.userIds}
                style={{ padding: 0 }}
                onClick={() => {
                  setVisible(items);
                }}>{items.qualityPlanResult ? items.qualityPlanResult.planName : '添加'}</Button>
            </div>
            <Divider style={{ margin: 0, marginTop: 8 }} />
          </div>;
        })
        :
        <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description='暂无数据'
        />
      }
    </Card>

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
      taskId={locationState.taskId}
      detail={detail}
      qualityTaskId={detail.detail && detail.detail.qualityTaskId}
      qualityDetailIds={detail.qualityLising.map((items) => {
        return items.qualityTaskDetailId;
      })}
      ref={ref} />

    <Dialog
      title='修改质检方案'
      visible={visible}
      content={<Selector
        defaultValue={typeof visible === 'object' && visible.qualityPlanId}
        options={qualityPlan || []}
        columns={1}
        onChange={(arr, { items }) => {
          setUpdateQualityPlan(items[0]);
        }}
      />
      }
      onAction={async (action) => {
        if (action.key === 'update') {
          const array = [];
          detail.qualityLising.map((items, index) => {
            if (items.qualityTaskDetailId === visible.qualityTaskDetailId) {
              array.push({
                ...visible,
                qualityPlanId: updateQualityPlan.value,
                qualityPlanResult: {
                  ...visible.qualityPlanResult,
                  planName: updateQualityPlan.label,
                },
              });
            } else {
              array.push(items);
            }
            return null;
          });

          setDetail({ ...detail, qualityLising: array });

          await update({
            data: {
              qualityTaskDetailId: visible.qualityTaskDetailId,
              qualityPlanId: updateQualityPlan,
            },
          });

          setUpdateQualityPlan(null);
          setVisible(false);
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

export default EditChildTask;
