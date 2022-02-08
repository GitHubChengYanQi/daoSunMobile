import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  List,
  Loading,
  SafeArea,
  Selector, Space,
  TextArea,
  Toast,
} from 'antd-mobile';
import LinkButton from '../../../../components/LinkButton';
import { history } from 'umi';
import { useRequest } from '../../../../../util/Request';
import { qualityPlanListSelect, qualityTaskDetailEdit } from '../components/URL';
import Dispatch from '../components/Dispatch';
import SkuResultSkuJsons from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import Number from '../../../../components/Number';
import { useSetState } from 'ahooks';

const EditChildTask = (props) => {

  const locationState = props.location.state;

  const action = locationState && locationState.action;

  const [note, setNote] = useState('');

  const [refuse, setRefuse] = useState(false);

  const [percentumNumber, setPercentumNumber] = useState();

  const [detail, setDetail] = useSetState(
    locationState
    &&
    {
      ...locationState.detail,
      qualityLising: locationState.detail.qualityLising.map((items) => {
        return { ...items, newNumber: items.remaining };
      }),
    });

  const ref = useRef();

  const [updateQualityPlan, setUpdateQualityPlan] = useState({});

  const [visible, setVisible] = useState(false);

  const [percentum, setPercentum] = useState(false);

  const { loading: qualityPlanLoading, data: qualityPlan, run: qualityPlanRun } = useRequest(
    qualityPlanListSelect,
    {
      manual: true,
    });

  const { run: update } = useRequest(qualityTaskDetailEdit,
    {
      manual: true,
      onSuccess: () => {
        setPercentum(false);
        Toast.show(
          {
            content: '修改成功！',
            position: 'bottom',
          },
        );
      },
    });

  // 驳回接口
  const { loading, run } = useRequest({
    url: 'qualityTaskRefuse/refuse',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '驳回成功！',
        position: 'bottom',
      });
      setRefuse(false);
      history.push(`/Work/Quality?id=${detail.detail && detail.detail.qualityTaskId}`);
    },
    onError: () => {
      Toast.show({
        content: '驳回失败！',
        position: 'bottom',
      });
    },
  });

  if (!detail) {
    return <MyEmpty />;
  }

  return <>
    <Card title={action === 'refuse' ? '任务驳回' : '任务指派'} extra={<LinkButton title='返回' onClick={() => {
      history.goBack();
    }} />}>
      <List>
        {detail.qualityLising ? detail.qualityLising.map((items, index) => {
            return <List.Item
              key={index}
              extra={
                <Number
                  center
                  buttonStyle={{
                    padding: '0 8px',
                    border: 'solid #999999 1px',
                    borderRadius: 10,
                    display: 'inline-block',
                  }}
                  color={(items.newNumber > 0 && items.newNumber <= items.remaining) ? 'blue' : 'red'}
                  width={80}
                  value={items.newNumber}
                  onChange={(value) => {
                    detail.qualityLising[index] = { ...detail.qualityLising[index], newNumber: value };
                    setDetail(detail);
                  }} />
              }
              title={
                <div style={{ color: '#000', fontSize: 16 }}>
                  <SkuResultSkuJsons skuResult={items.skuResult} />
                </div>
              }
            >
              <div>
                品牌：{items.brand && items.brand.brandName}
              </div>
              <div>
                供应商：{items.customerResult && items.customerResult.customerName}
              </div>
              <div>
                {action === 'refuse' ?
                  items.qualityPlanResult && items.qualityPlanResult.planName
                  :
                  <Button
                    color='primary'
                    fill='none'
                    disabled={items.userIds}
                    style={{ padding: 0 }}
                    onClick={async () => {
                      await qualityPlanRun({
                        data: {
                          testingType: items.skuResult.batch === 1 ? 1 : 2,
                        },
                      });
                      setPercentumNumber((items.percentum || 1) * 100);
                      setVisible(items);
                      setUpdateQualityPlan({
                        value: items.qualityPlanId,
                        label: items.qualityPlanResult && items.qualityPlanResult.planName,
                      });
                    }}>{items.qualityPlanResult ? items.qualityPlanResult.planName : '添加'}</Button>}
              </div>
              {items.qualityPlanResult && <div>
                {items.skuResult.batch === 1 ?
                  `抽检 ${(items.percentum || 1) * 100}%`
                  :
                  '固定检查'
                }
              </div>}
            </List.Item>;
          })
          :
          <MyEmpty />
        }
      </List>
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
          loading={loading}
          style={{
            padding: 8,
            width: '100%',
            backgroundColor: '#4B8BF5',
            borderRadius: 50,
          }}
          color='primary'
          onClick={async () => {
            if (action === 'refuse') {
              setRefuse(true);
            } else {
              const plans = detail.qualityLising.filter((items) => {
                return !items.qualityPlanId;
              });
              const newNumber = detail.qualityLising.filter((items) => {
                return !(items.newNumber > 0 && items.newNumber <= items.remaining);
              });
              if (plans.length > 0) {
                return Toast.show({
                  content: '请添加质检方案！',
                  position: 'bottom',
                });
              }
              if (newNumber.length > 0) {
                return Toast.show({
                  content: '请检查数量！',
                  position: 'bottom',
                });
              }

              ref.current.setVisiable(true);
            }
          }}>
          {action === 'refuse' ? '驳回' : '指派'}
        </Button>
      </div>
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>

    <Dialog
      visible={refuse}
      title={`是否执行驳回操作?`}
      content={<TextArea
        placeholder='请输入驳回原因...'
        rows={2}
        maxLength={50}
        showCount
        onChange={(value) => {
          setNote(value);
        }} />}
      onAction={async (action) => {
        if (action.key === 'confirm') {
          await run({
            data: {
              note,
              qualityTaskId: detail.detail && detail.detail.qualityTaskId,
              detailParams: detail.qualityLising,
            },
          });
        } else {
          setRefuse(false);
        }
      }}
      actions={[
        [
          {
            disabled: loading,
            key: 'confirm',
            text: loading ? <Loading /> : '确定',
          },
          {
            key: 'close',
            text: '取消',
          },
        ],
      ]}
    />

    <Dispatch
      detail={detail}
      ref={ref}
    />

    <Dialog
      title='修改质检方案'
      visible={visible}
      content={<Selector
        value={updateQualityPlan ? updateQualityPlan.value : null}
        options={qualityPlan || []}
        columns={1}
        onChange={(arr, { items }) => {
          setUpdateQualityPlan(items[0]);
        }}
      />
      }
      onAction={async (action) => {
        if (action.key === 'update') {
          setPercentum(visible);
        }
        setVisible(false);
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

    <Dialog
      title='抽检比例'
      visible={percentum}
      content={<div style={{ textAlign: 'center' }}><Space align='center'>
        <Number
          center
          value={percentumNumber}
          onChange={setPercentumNumber}
          placeholder='请输入（%）'
          width={100}
          color={(percentumNumber <= 0 || percentumNumber > 100) ? 'red' : 'blue'}
        /> %
      </Space></div>}
      onAction={async () => {
        if (percentumNumber <= 0 || percentumNumber > 100) {
          return Toast.show({
            content: '请输入正确比例！',
            position: 'bottom',
          });
        }
        const array = [];
        detail.qualityLising.map((items) => {
          if (items.qualityTaskDetailId === percentum.qualityTaskDetailId) {
            array.push({
              ...percentum,
              percentum: percentumNumber / 100,
              qualityPlanId: updateQualityPlan.value,
              qualityPlanResult: {
                ...percentum.qualityPlanResult,
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
            qualityTaskDetailId: percentum.qualityTaskDetailId,
            qualityPlanId: updateQualityPlan.value,
            percentum: percentumNumber / 100,
          },
        });
      }}
      actions={[
        [{
          key: 'ok',
          text: '确定',
        }],
      ]}
    />

    {qualityPlanLoading && <MyLoading />}

  </>;
};

export default EditChildTask;
