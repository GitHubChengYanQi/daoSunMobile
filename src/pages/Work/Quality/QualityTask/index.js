import React, { useState } from 'react';
import { Affix, Col, Row } from 'antd';
import {
  Badge,
  Button,
  Card,
  Dialog,
  Divider,
  Ellipsis,
  Empty, List, Loading,
  Radio,
  SafeArea,
  SideBar,
  Space,
} from 'antd-mobile';
import style from '../index.css';
import { NumberInput, TextArea, WhiteSpace } from 'weui-react-v2';
import pares from 'html-react-parser';
import LinkButton from '../../../components/LinkButton';
import { history } from 'umi';
import { useRequest } from '../../../../util/Request';
import ImgUpload from '../../../components/Upload/ImgUpload';
import UpLoadImg from '../../../components/Upload';
import { CheckOutlined, CloseOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useDebounceEffect } from 'ahooks';
import MyEmpty from '../../../components/MyEmpty';
import SkuResult from '../../../Scan/Sku/components/SkuResult';

const QualityTask = (props) => {

  const state = props.location.state;
  console.log(state);

  const items = state && state.items;

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
  const { loading, data, run, refresh } = useRequest({
    url: '/qualityTask/backDataValue',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
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

        setValues(new Array(res.dataValueResults.length));


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

  // 下一步操作
  const { loading: nextLoading, run: next } = useRequest({
    url: '/qualityTask/updateDataValue',
    method: 'POST',
  }, {
    manual: true,
  });

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
        const qualitys = data.dataValueResults && data.dataValueResults.filter((items) => {
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
  // 判断
  const getJudge = (value, index) => {

    let judge = true;

    const planType = data.dataValueResults[index].qualityPlanDetailResult;

    // 必填不输入判定未false
    if (planType.isNull && !value) {
      return false;
    }

    if (value) {
      switch (planType.qualityCheckResult && planType.qualityCheckResult.type) {
        case 3:
          judge = value === '1';
          break;
        case 1:
        case 4:
          switch (planType.operator) {
            case 1:
              judge = value === parseInt(planType.standardValue);
              break;
            case 2:
              judge = value >= parseInt(planType.standardValue);
              break;
            case 3:
              judge = value <= parseInt(planType.standardValue);
              break;
            case 4:
              judge = value > parseInt(planType.standardValue);
              break;
            case 5:
              judge = value < parseInt(planType.standardValue);
              break;
            case 6:
              judge = value > parseInt(planType.standardValue.split(',')[0]) && value < parseInt(planType.standardValue.split(',')[1]);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    return judge;
  };


  useDebounceEffect(() => {
    if (state && state.codeId && items) {
      run({
        params: {
          id: state.codeId,
          type: items.batch ? 'sampling' : 'fixed',
        },
      });
    }
  }, [], {
    wait: 0,
  });

  if (loading) {
    return <Loading />;
  }

  if (!(data && data.dataValueResults)) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }


  // 储存输入的值
  const onChange = (value, imgValues, judge) => {

    const array = [];
    values.map((items, index) => {
      return array[index] = items;
    });

    if (value) {
      array[key] = {
        value,
        imgValues: values[key] && values[key].imgValues,
        judge: values[key] && values[key].judge,
      };
    } else if (imgValues) {
      array[key] = {
        value: values[key] && values[key].value,
        imgValues,
        judge: values[key] && values[key].judge,
      };
    } else if (judge !== undefined) {
      array[key] = {
        value: values[key] && values[key].value,
        imgValues: values[key] && values[key].imgValues,
        judge,
      };
    }

    setValues(array);

  };

  const changeValue = (status) => {

    if (plan) {
      const Operator = (value, bai) => {
        switch (value) {
          case 1:
            return <span style={{ color: '#639bf8' }}>{'='}{plan.standardValue}{bai && '%'}</span>;
          case 2:
            return <span style={{ color: '#639bf8' }}>{'>='}{plan.standardValue}{bai && '%'}</span>;
          case 3:
            return <span style={{ color: '#639bf8' }}>{'<='}{plan.standardValue}{bai && '%'}</span>;
          case 4:
            return <span style={{ color: '#639bf8' }}>{'>'}{plan.standardValue}{bai && '%'}</span>;
          case 5:
            return <span style={{ color: '#639bf8' }}>{'<'}{plan.standardValue}{bai && '%'}</span>;
          case 6:
            return <span
              style={{ color: '#639bf8' }}>{`${plan.standardValue.split(',')[0]}`} {`${bai ? '%' : ''}`} &nbsp;—&nbsp; {`${plan.standardValue.split(',')[1]}`} {`${bai ? '%' : ''}`}</span>;
          default:
            break;
        }
      };

      switch (plan.qualityCheckResult && plan.qualityCheckResult.type) {
        case 1:
          return <div>
            <div>
              <span style={{
                fontSize: 16,
                color: '#639bf8',
              }}>合格标准：</span>{Operator(plan.operator)} &nbsp;&nbsp;&nbsp;&nbsp;
              <strong style={{ fontSize: 16, color: '#639bf8' }}>{plan.unit && plan.unit.unitName}</strong>
            </div>
            <WhiteSpace size='sm' />
            <div>
              <Space align='center'>
                <span style={{ fontSize: 16 }}>验收值：</span>
                <NumberInput
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eee',
                    padding: '0 8px',
                    fontSize: 8,
                    maxWidth: 120,
                  }}
                  disabled={status}
                  placeholder='输入结果'
                  precision={5}
                  value={values[key] && values[key].value || ''}
                  onChange={(val) => {
                    onChange(val);
                  }} />
                {plan.unit && plan.unit.unitName}
              </Space>
            </div>
          </div>;
        case 2:
          return <div>
            <TextArea
              style={{ border: '1px solid #eee', padding: 8 }}
              placeholder='输入文本'
              disabled={status}
              value={values[key] && values[key].value || ''}
              onChange={(val) => {
                onChange(val);
              }} />
          </div>;
        case 3:
          return <div>
            <Radio.Group
              disabled={status}
              value={values[key] && values[key].value || ''}
              onChange={(val) => {
                onChange(val);
              }}>
              <Space direction='horizontal'>
                <Radio value='1'>合格</Radio>
                <Radio value='0'>不合格</Radio>
              </Space>
            </Radio.Group>
          </div>;
        case 4:
          return <div>
            <div>
              <span style={{ fontSize: 16, color: '#639bf8' }}>合格标准：</span>
              <strong style={{ fontSize: 16 }}>{Operator(plan.operator, true)}</strong></div>
            <WhiteSpace size='sm' />
            <div><Space align='center'><span style={{ fontSize: 16 }}>验收值：</span>
              <NumberInput
                disabled={status}
                min={0}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eee',
                  padding: '0 8px',
                  fontSize: 8,
                  maxWidth: 150,
                }}
                max={100}
                placeholder='输入检测结果(%)'
                value={values[key] && values[key].value || ''}
                onChange={(value) => {
                  onChange(value);
                }} /></Space></div>
          </div>;
        case 5:
          return <UpLoadImg
            disabled={status}
            value={values[key] && values[key].value || ''}
            onChange={(value) => {
              onChange(value);
            }} />;
        default:
          break;
      }
    } else {
      return null;
    }

  };

  // 上传图片
  const imgs = (status) => {

    if (status) {
      if (values[key] && values[key].imgValues) {
        return <>
          <WhiteSpace size='sm' />
          <span style={{
            fontSize: 16,
          }}>拍照 / 录像：</span>
          <div style={{ padding: 8 }}>
            <ImgUpload
              loading={plan}
              value={values[key] && values[key].imgValues || []}
              disabled={status}
              onChange={(value) => {
                onChange(null, value);
              }} />
          </div>
        </>;
      } else {
        return null;
      }
    } else {
      return <>
        <WhiteSpace size='sm' />
        <span style={{
          fontSize: 16,
        }}>拍照 / 录像：</span>
        <div style={{ padding: 8 }}>
          <ImgUpload
            loading={plan}
            value={values[key] && values[key].imgValues || []}
            disabled={status}
            onChange={(value) => {
              onChange(null, value);
            }} />
        </div>
      </>;
    }
  };

  const judgeValue = (value) => {
    if (value === true) {
      return 1;
    } else if (value === false) {
      return 0;
    }
    return null;
  };

  // 检验结果
  const res = (value) => {
    if (value === true) {
      return <><CheckOutlined style={{ color: 'green' }} /></>;
    } else if (value === false) {
      return <><CloseOutlined style={{ color: 'red' }} /></>;
    } else {
      return null;
    }
  };

  if (!items)
    return <MyEmpty />


  return <div>
    <Card title='质检任务' extra={<LinkButton onClick={() => {
      history.push(`/Work/Quality?id=${items.qualityTaskId}`);
    }} title='返回' />}>
      <>
        <List.Item>
          <QrcodeOutlined /> &nbsp;&nbsp;{state.codeId}
        </List.Item>
        <List.Item>
          <SkuResult skuResult={items.skuResult} />
        </List.Item>
        <List.Item>品牌 / 供应商：{items.brand && items.brand.brandName}</List.Item>
        <List.Item>数量：{items.number}</List.Item>
      </>

      <Affix offsetTop={0}>
        <Divider>质检项</Divider>

        <Row gutter={24}>
          <Col span={7} style={{ height: '100vh', backgroundColor: '#f5f5f5', padding: 0 }}>
            <div style={{ maxHeight: '70%', overflowY: 'auto' }}>
              <SideBar
                style={{ '--width': '100%', overflowY: 'auto', overflowX: 'hidden' }}
                activeKey={key}
                onChange={(value) => {
                  setValueId(data.dataValueResults[value].valueId);
                  setPlan(data.dataValueResults[value].qualityPlanDetailResult);
                  setKey(value);
                }}>
                {
                  data.dataValueResults.map((items, index) => {
                    return <SideBar.Item
                      key={index}
                      className={style.sidebar}
                      badge={!(values[index] && values[index].judge !== undefined) && Badge.dot}
                      title={
                        <Space style={{ width: '100%' }} className={style.space}>
                          <div style={{ width: '100%', display: 'inline-block' }}>
                            <Ellipsis
                              rows={1}
                              style={{ fontSize: 16 }}
                              direction='end'
                              content={
                                items.qualityPlanDetailResult
                                &&
                                items.qualityPlanDetailResult.qualityCheckResult
                                &&
                                items.qualityPlanDetailResult.qualityCheckResult.name} />
                          </div>
                          <div style={{ display: 'inline-block', width: '20%' }}>
                            {values[index] && values[index].judge !== undefined && res(!!values[index].judge)}
                          </div>
                        </Space>} />;
                  })
                }
              </SideBar>
            </div>
          </Col>
          <Col span={16} style={{ padding: 8, height: '100vh' }}>
            <div style={{ maxHeight: '70%', overflowY: 'auto' }}>
              <Card
                title={<>
                  {
                    plan.isNull === 1
                    &&
                    <span style={{ color: 'red', marginRight: 4 }}>*</span>
                  }
                  <Ellipsis style={{ display: 'inline-block' }} direction='end' content={
                    '质检项：' + (plan.qualityCheckResult ? plan.qualityCheckResult.name : '')
                  } />
                </>

                }
                headerStyle={{ borderLeft: 'solid 4px #000', padding: 8 }}>
                {changeValue(status || values[key] && values[key].judge !== undefined)}
                {imgs(status || values[key] && values[key].judge !== undefined)}
                <WhiteSpace size='sm' />
                <div>
                  <Button
                    disabled={status || values[key] && values[key].judge !== undefined}
                    loading={nextLoading}
                    color='primary'
                    block
                    style={{ backgroundColor: '#4B8BF5', width: '100%', borderRadius: 50 }}
                    onClick={async () => {

                      const judge = getJudge(values[key] && values[key].value, key);

                      onChange(null, null, judge);

                      await next({
                        data: {
                          id: valueId,
                          dataValues: {
                            value: values[key] && values[key].value,
                            imgValues: values[key] && values[key].imgValues,
                            judge: judgeValue(judge),
                          },
                        },
                      });

                      if (parseInt(key) !== (data.dataValueResults.length - 1)) {
                        setKey(`${parseInt(key) + 1}`);
                        setPlan(data.dataValueResults[parseInt(key) + 1].qualityPlanDetailResult);
                        setValueId(data.dataValueResults[parseInt(key) + 1].valueId);
                      }

                    }}>下一项</Button>
                </div>
              </Card>

              <Divider>其他信息</Divider>
              <WhiteSpace size='sm' />
              <div>
                <span style={{ fontSize: 16, color: '#999' }}>工具:</span>
              </div>
              <WhiteSpace size='sm' />
              <div>
                <span style={{ fontSize: 16, color: '#999' }}>规范：</span>
                <Button color='primary' fill='none' style={{ padding: 0 }} onClick={() => {
                  Dialog.alert({
                    content: pares(plan && plan.qualityCheckResult && plan.qualityCheckResult.norm),
                  });
                }}>查看</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Affix>
      <div style={{
        width: '100%',
        paddingBottom: 0,
        zIndex: 99,
        padding: '0 8px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
      }}>
        <Button
          disabled={status}
          loading={completeLoading || batchLoading}
          style={{
            width: '100%',
            backgroundColor: '#4B8BF5',
            borderRadius: 50,
          }}
          color='primary'
          onClick={() => {
            complete({
              data: {
                valueIds: data.dataValueResults.map((items) => {
                  return items.valueId;
                }),
                status: 99,
                taskDetailId: state.taskDetailId,
              },
            });
          }}
        >
          检验完成
        </Button>
        <SafeArea position='bottom' />
      </div>
    </Card>
  </div>;
};

export default QualityTask;
