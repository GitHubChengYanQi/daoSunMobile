import React from 'react';
import { Badge, Button, Card, Dialog, Divider, Ellipsis, Radio, SideBar, Space } from 'antd-mobile';
import { Col, Row } from 'antd';
import style from '../../index.css';
import { NumberInput, TextArea, WhiteSpace } from 'weui-react-v2';
import pares from 'html-react-parser';
import UpLoadImg from '../../../../components/Upload';
import ImgUpload from '../../../../components/Upload/ImgUpload';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEllipsis from '../../../../components/MyEllipsis';
import Label from '../../../../components/Label';

const QualityPlan = (
  {
    data = [],
    plan,
    setPlan,
    valueId,
    setValueId,
    keyValue: key,
    setKey,
    values,
    setValues,
    status,
    module,
  },
) => {


  // 下一步操作
  const { loading: nextLoading, run: next } = useRequest({
    url: '/qualityTask/updateDataValue',
    method: 'POST',
  }, {
    manual: true,
  });

  // 判断
  const getJudge = (value, index) => {

    let judge = true;

    const planType = data[index].qualityPlanDetailResult;

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
            <Label>合格标准：</Label>
            <div style={{ display: 'inline-block' }}>
              {Operator(plan.operator)}
            </div>
            <Divider />
            <Label>单位：</Label>
            <div style={{ display: 'inline-block' }}>
              {plan.unit && plan.unit.unitName}
            </div>
            <Divider />
            <div style={{ display: 'flex' }}>
              <div style={{ width: '32vw' }}>
                <Label>验收值：</Label>
              </div>
              <NumberInput
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eee',
                  padding: '0 8px',
                  fontSize: 8,
                }}
                disabled={status}
                placeholder='输入结果'
                precision={5}
                value={values[key] && values[key].value || ''}
                onChange={(val) => {
                  onChange(val);
                }} />
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
              <Label>合格标准：</Label>
              <div style={{ display: 'inline-block' }}>
                {Operator(plan.operator, true)}
              </div>
            </div>
            <Divider />
            <div style={{ display: 'flex' }}>
              <div style={{ width: '32vw' }}>
                <Label>验收值：</Label>
              </div>
              <NumberInput
                disabled={status}
                min={0}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eee',
                  padding: '0 8px',
                  fontSize: 8,
                }}
                max={100}
                placeholder='输入检测结果(%)'
                value={values[key] && values[key].value || ''}
                onChange={(value) => {
                  onChange(value);
                }} />
            </div>
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


  return <div style={{overflowX:'hidden'}}>
    <Divider>质检项</Divider>

    <Row gutter={24}>
      <Col span={7} style={{ backgroundColor: '#f5f5f5', padding: 0, maxHeight: '90vh', overflowY: 'auto',overflowX:'hidden' }}>
        <div>
          <SideBar
            style={{ '--width': '100%', overflowY: 'auto', overflowX: 'hidden'}}
            activeKey={key}
            onChange={(value) => {
              setValueId(data[value].valueId);
              setPlan(data[value].qualityPlanDetailResult);
              setKey(value);
            }}>
            {
              data.map((items, index) => {
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
      <Col span={16} style={{ padding: 8, maxHeight: '90vh', overflowY: 'auto',overflowX:'hidden' }}>
        <div>
          <Card
            title={<div style={{ display: 'flex' }}>
              {
                plan.isNull === 1
                &&
                <span style={{ color: 'red', marginRight: 4 }}>*</span>
              }
              <div style={{ flexGrow: 1 }}>
                <MyEllipsis width='70%'>质检项：{plan.qualityCheckResult ? plan.qualityCheckResult.name : ''}</MyEllipsis>
              </div>
            </div>

            }
            headerStyle={{ borderLeft: 'solid 4px #000', padding: 8, display: 'block' }}
          >
            {changeValue(status || values[key] && values[key].judge !== undefined)}
            <Divider />
            {imgs(status || values[key] && values[key].judge !== undefined)}
            <Divider />
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

                  switch (module) {
                    case 'production':
                      break;
                    default:
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
                      break;
                  }

                  if (parseInt(key) !== (data.length - 1)) {
                    setKey(`${parseInt(key) + 1}`);
                    setPlan(data[parseInt(key) + 1].qualityPlanDetailResult);
                    setValueId(data[parseInt(key) + 1].valueId);
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
    {nextLoading && <MyLoading />}
  </div>;
};

export default QualityPlan;
