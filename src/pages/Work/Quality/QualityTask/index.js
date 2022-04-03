import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  Empty,
  List,
  Loading, Space,
} from 'antd-mobile';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import { useRequest } from '../../../../util/Request';
import { QrcodeOutlined } from '@ant-design/icons';
import MyEmpty from '../../../components/MyEmpty';
import { MyLoading } from '../../../components/MyLoading';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import QualityPlan from './QualityPlan';
import BottomButton from '../../../components/BottomButton';
import Label from '../../../components/Label';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEllipsis from '../../../components/MyEllipsis';
import MyNavBar from '../../../components/MyNavBar';
import { Message } from '../../../components/Message';

const QualityTask = (props) => {

  const state = props.location.state;

  const params = props.location.query;

  const module = params && params.module;

  const [items, setItems] = useState(state && state.items);

  const [detailResults, setDetailResults] = useState([]);

  //当前选中的质检项 {}
  const [plan, setPlan] = useState({});

  // 记录当前的valueId
  const [valueId, setValueId] = useState();

  // 当前质检报告的状态
  const [status, setStatus] = useState(false);

  // 记录当前的key
  const [key, setKey] = useState('0');

  // 保存质检项的值
  const [values, setValues] = useState([]);

  // 获取质检项信息
  const { loading, run, refresh } = useRequest({
    url: '/qualityTask/backDataValue',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      setDetailResults(res.dataValueResults);
      setStatus(res.data && (res.data.status > 0));
      if (res && res.dataValueResults) {

        let key = null;
        const nullValues = res.dataValueResults.filter((value, index) => {
          if (!value.dataValues.value && key === null) {
            key = `${index}`;
          }
          return !value.dataValues.value;
        });

        if (nullValues.length > 0) {
          setPlan(nullValues[0].qualityPlanDetailResult);
          setValueId(nullValues[0].valueId);
          setKey(key);
        } else {
          setPlan(res.dataValueResults[0].qualityPlanDetailResult);
          setValueId(res.dataValueResults[0].valueId);
        }


        const values = res.dataValueResults.map((items) => {
          return {
            value: items.dataValues.value,
            judge: items.dataValues.value ? (items.dataValues.judge === 1) : undefined,
            imgValues: items.dataValues.imgValues,
          };
        });
        setValues(values);
      }
    },
  });

  // 生产自检完成
  const { loading: productionOkLoading, run: productionOkRun } = useRequest({
    url: '/qualityTask/saveSelfQuality',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      Message.dialogSuccess(
        '自检成功!',
        '返回生产任务',
        '继续自检报工',
        () => {
          productionRefresh();
        },
      );
    },
    onError: (res) => {
      Message.error('自检失败！');
    },
  });

  // 生产自检
  const {
    loading: productionLoading,
    run: productionRun,
    refresh: productionRefresh,
  } = useRequest({
    url: '/qualityTask/selfQuality',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setItems({
        skuResult: res.skuResult,
        skuId: params.skuId,
        number: 1,
      });
      if (res.dataValueResults) {
        setPlan(res.dataValueResults[0].qualityPlanDetailResult);
        setDetailResults(res.dataValueResults);
        const values = res.dataValueResults.map((items) => {
          return {
            value: undefined,
            judge: undefined,
            imgValues: undefined,
          };
        });
        setValues(values);
      }
      setKey('0');
    },
  });

  // 抽检完成之后再次添加质检报告
  const { loading: batchLoading, run: addData } = useRequest(
    {
      url: '/qualityTask/addData',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        history.push(`/Work/Quality?id=${items.qualityTaskId}`);
      },
    },
  );

  // 完成操作
  const { loading: completeLoading, run: complete } = useRequest({
    url: '/qualityTask/taskComplete',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: async (res) => {
      if (res && res.length === 0) {
        // 如果是抽检，完成之后再次添加一条数据
        if (items.batch && (items.remaining + 1) !== Math.ceil(items.number * items.percentum)) {
          await addData({
            data: {
              module: 'item',
              qrCodeId: state.codeId,
              planId: items.qualityPlanId,
            },
          });
        } else {
          history.push(`/Work/Quality?id=${items.qualityTaskId}`);
        }
      } else {
        // 提示未填写的必填项
        const qualitys = detailResults.filter((items) => {
          return res.filter((value) => {
            return value === items.valueId;
          }).length > 0;
        });

        Dialog.alert({
          title: '请检查必填项',
          onConfirm: () => {
            refresh();
          },
          content: <>
            {
              qualitys && qualitys.map((items, index) => {
                return <List.Item key={index} style={{ textAlign: 'center' }}>
                  {
                    items.qualityPlanDetailResult
                    &&
                    items.qualityPlanDetailResult.qualityCheckResult
                    &&
                    items.qualityPlanDetailResult.qualityCheckResult.name
                  }
                </List.Item>;
              })
            }
          </>,
        });
      }
    },
  });


  useEffect(() => {
    switch (module) {
      case 'production':
        productionRun({
          data: {
            productionTaskId: params.productionTaskId,
            skuId: params.skuId,
            pualityPlanId: params.qualityId,
          },
        });
        break;
      default:
        break;
    }
    if (state && state.codeId && items) {
      run({
        params: {
          id: state.codeId,
          type: items.batch ? 'sampling' : 'fixed',
        },
      });
    }
  }, []);

  if (detailResults.length === 0) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  const backgroundDom = () => {
    if (!items) {
      return <MyEmpty />;
    }

    return <Card
      headerStyle={{ display: 'block' }}
      title={
        <div>
          <MyEllipsis>
            <SkuResultSkuJsons skuResult={items.skuResult} />
          </MyEllipsis>
        </div>
      }
    >
      <div style={{ display: 'flex' }}>
        <Label>物料描述：</Label>
        <MyEllipsis width='60%'><SkuResultSkuJsons describe skuResult={items.skuResult} /></MyEllipsis>
      </div>
      <div>
        <Label>数量：</Label>{items.number}
      </div>
      {state && <Space>
        <Label> <QrcodeOutlined /></Label>{state.codeId}
      </Space>}
    </Card>;
  };

  return <div>
    <MyNavBar title='质检详情' />
    <MyFloatingPanel
      backgroundDom={backgroundDom()}
      backgroundColor
    >
      <QualityPlan
        setKey={setKey}
        setPlan={setPlan}
        setValueId={setValueId}
        status={status}
        setValues={setValues}
        values={values}
        data={detailResults}
        plan={plan}
        module={module}
        valueId={valueId}
        keyValue={key}
      />
    </MyFloatingPanel>

    <BottomButton
      only
      disabled={status}
      loading={completeLoading || batchLoading}
      text='检验完成'
      onClick={() => {
        switch (module) {
          case 'production':

            const noNull = [];
            const dataValueParams = detailResults.map((item, index) => {
              if (item.qualityPlanDetailResult && item.qualityPlanDetailResult.isNull === 1) {
                if (values[index].value === undefined || values[index].value === null) {
                  noNull.push(item);
                }
              }
              return {
                value: values[index],
                field: item.planDetailId,
              };
            });

            if (noNull.length > 0) {
              Dialog.alert({
                title: '请检查必填项',
                content: <>
                  {
                    noNull.map((items, index) => {
                      return <List.Item key={index} style={{ textAlign: 'center' }}>
                        {
                          items.qualityPlanDetailResult
                          &&
                          items.qualityPlanDetailResult.qualityCheckResult
                          &&
                          items.qualityPlanDetailResult.qualityCheckResult.name
                        }
                      </List.Item>;
                    })
                  }
                </>,
              });
              return;
            }
            productionOkRun({
              data: {
                planId: params.qualityId,
                skuId: params.skuId,
                productionTaskId: params.productionTaskId,
                dataValueParams,
              },
            });
            break;
          default:
            complete({
              data: {
                valueIds: detailResults.map((items) => {
                  return items.valueId;
                }),
                status: 99,
                taskDetailId: items.qualityTaskDetailId,
              },
            });
            break;
        }
      }}
    />

    {(loading || batchLoading || completeLoading || productionLoading || productionOkLoading) && <MyLoading />}
  </div>;
};

export default QualityTask;
