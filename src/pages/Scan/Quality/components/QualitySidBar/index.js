import { Col, Row } from 'antd';
import { Badge, Button, Card, Dialog, Divider, Ellipsis, Radio, SafeArea, SideBar, Space, Toast } from 'antd-mobile';
import { CheckOutlined, CloseOutlined, ScanOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { NumberInput, TextArea, WhiteSpace } from 'weui-react-v2';
import UpLoadImg from '../../../../components/Upload';
import { request, useRequest } from '../../../../../util/Request';
import wx from 'populee-weixin-js-sdk';
import pares from 'html-react-parser';
import style from '../../index.css';
import ImgUpload from '../../../../components/Upload/ImgUpload';
import { useBoolean } from 'ahooks';
import { qualityTaskDetailEdit } from '../../../../Work/Workflow/DispatchTask/components/URL';

const testCodeId = '1461996334550953986';

const QualitySidBar = (
  {
    data,
    batch,
    taskId,
    values,
    allValues,
    number,
    index,
    onChange,
    defaultValue,
  },
) => {

  // 侧边导航的key
  const [key, setKey] = useState('0');

  const [imgloading, { toggle }] = useBoolean();

  // 绑定的二维码id
  const [bind, setBind] = useState(values && values.bind);

  //当前选中的质检项 {}
  const [plan, setPlan] = useState(data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[key]);

  //记录填入的值 【】
  const [value, setValue] = useState((values && values.values && values.values.map((items) => {
    return items && items.values;
  })) || []);

  const { loading, run: addData } = useRequest(
    {
      url: '/qualityTask/addData',
      method: 'POST',
    },
    {
      manual: true,
    },
  );

  const { run } = useRequest(
    {
      url: '/qualityTaskDetail/backValue',
      method: 'GET',
    }, {
      manual: true,
      onSuccess: (res) => {
        const value = res.map((items, index) => {
          if (items.value) {
            return {
              judge: getJudge(JSON.parse(items.value).value, index),
              values: JSON.parse(items.value),
            };
          } else {
            return null;
          }

        });
        setState(value);
        setValue(value.map((items) => {
          return items && items.values;
        }));
      },
    },
  );

  useEffect(() => {
    if (!values && data.inkindId && data.inkindId.split(',')[index]) {
      run({
        params: {
          inkind: data.inkindId.split(',')[index],
        },
      });
    }
  }, [data.inkindId, index, run, values]);


  // 所有状态
  const [state, setState] = useState(values && values.values || []);

  // 判断二维码状态
  const code = async (codeId, items) => {

    const isBind = await request(
      {
        url: '/orCode/isNotBind',
        method: 'POST',
        data: {
          codeId: codeId,
        },
      },
    );
    // 判断是否是未绑定过的码
    if (isBind) {
      //如果已绑定
      Toast.show({
        content: '二维码已绑定其他物料，请重新选择!',
        icon: 'fail',
      });
    } else {
      //如果未绑定，提示用户绑定
      codeBind(codeId, items);
    }
  };

  // 开启扫码
  const scan = async (items) => {
    if (process.env.NODE_ENV === 'development') {
      code(testCodeId, items);
    } else {
      await wx.ready(async () => {
        await wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: (res) => {
            if (res.resultStr.indexOf('https') !== -1) {
              const param = res.resultStr.split('=');
              if (param && param[1]) {
                code(param[1], items);
              }
            } else {
              code(res.resultStr, items);
            }
          },
          error: (res) => {
            alert(res);
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              // alert('版本过低请升级');
            }
          },
        });
      });
    }
  };

  // 绑定二维码
  const codeBind = (codeId, items) => {
    Dialog.show({
      content: `是否绑定此二维码？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {

          await request({
            url: '/orCode/backCode',
            method: 'POST',
            data: {
              codeId: codeId,
              source: 'item',
              ...items,
              id: items.skuId,
              number: batch ? number : 1,
              inkindType: '质检',
            },
          }).then(async (res) => {
            if (typeof res === 'string') {
              setBind(res);
              typeof defaultValue === 'function' && defaultValue({
                bind: res,
                res: values && values.res,
                values: state,
              });

              let inkindId = [];

              if (batch) {
                inkindId = res;
              } else {
                if (data.inkindId) {
                  const inkinds = data.inkindId.split(',');
                  allValues.map((items) => {
                    if (items.bind) {
                      console.log(values.bind);
                      inkinds.push(items.bind);
                    }
                    return null;
                  });
                  inkinds.push(res);
                  inkindId = inkinds.toString();
                } else {
                  const arr = [];
                  allValues.map((items) => {
                    if (items.bind) {
                      arr.push(items.bind);
                    }
                    return null;
                  });
                  arr.push(res);
                  inkindId = arr.toString();
                }
              }


              await request({
                ...qualityTaskDetailEdit,
                data: {
                  qualityTaskDetailId: data.qualityTaskDetailId,
                  inkindId: inkindId,
                },
              });

              Toast.show({
                content: '绑定成功！',
              });
            }
          });

        }

      },
      actions: [
        [
          {
            key: 'ok',
            text: '是',
          },
          {
            key: 'no',
            text: '否',
          },
        ],
      ],
    });
  };

  // 检验结果图标
  const res = (value) => {
    if (value === true) {
      return <><CheckOutlined style={{ color: 'green' }} /></>;
    } else if (value === false) {
      return <><CloseOutlined style={{ color: 'red' }} /></>;
    } else {
      return null;
    }
  };


  // 记录验收值的集合
  const change = (val, imgs) => {

    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = { value: val || value[key] && value[key].value, imgValues: imgs || value[key] && value[key].imgValues };

    setValue(arrs);
  };

  // 判断
  const getJudge = (value, index) => {
    let judge = true;

    const planType = data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[index];

    if (value) {
      switch (planType.qualityCheckResult && planType.qualityCheckResult.type) {
        case 3:
          judge = value === '1';
          break;
        case 1:
        case 5:
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


  // 质检完成
  const comlete = async (arrs) => {

    const qualityPlanIds =
      data
      &&
      data.qualityPlanResult
      &&
      data.qualityPlanResult.qualityPlanDetailParams
      &&
      data.qualityPlanResult.qualityPlanDetailParams.map((items, index) => {
        return items.planDetailId;
      });

    const formValues = qualityPlanIds && qualityPlanIds.map((items, index) => {
      return {
        field: items,
        dataValues: arrs[index].values,
      };
    });

    console.log(JSON.stringify({
      taskId,
      formId: data.inkindId ? (data.inkindId.split(',')[index] || bind) : bind,
      formValues,
      module: 'item',
      number: batch ? number : 1,
      qualityTaskDetailId: data.qualityTaskDetailId,
    }));

    await addData({
      data: {
        taskId,
        formId: data.inkindId ? (data.inkindId.split(',')[index] || bind) : bind,
        formValues,
        module: 'item',
        number: batch ? number : 1,
        qualityTaskDetailId: data.qualityTaskDetailId,
      },
    });


    const judge = arrs.filter((value) => {
      return value.judge === false;
    });

    Toast.show({
      content: '检验完成！',
    });

    typeof onChange === 'function' && onChange({ bind, res: judge.length <= 0, values: arrs });
  };


  // 控制状态
  const sysState = (val, judge) => {

    const arrs = [];

    state.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = { judge, values: val };

    setState(arrs);

    typeof defaultValue === 'function' && defaultValue({ bind, res: values && values.key, values: arrs });

    return arrs.length !== data.qualityPlanResult.qualityPlanDetailParams.length;

  };


  const bars = (disabled) => {

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
                  placeholder='输入结果'
                  disabled={disabled}
                  precision={5}
                  value={value[key] && value[key].value || ''}
                  onChange={(val) => {
                    change(val);
                  }} />
                {plan.unit && plan.unit.unitName}
              </Space>
            </div>
          </div>;
        case 2:
          return <div>
            <TextArea
              disabled={disabled}
              style={{ border: '1px solid #eee', padding: 8 }}
              placeholder='输入文本'
              value={value[key] && value[key].value || ''}
              onChange={(val) => {
                change(val);
              }} />
          </div>;
        case 3:
          return <div>
            <Radio.Group value={value[key] && value[key].value || ''} onChange={(val) => {
              change(val);
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
                min={0}
                disabled={disabled}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eee',
                  padding: '0 8px',
                  fontSize: 8,
                  maxWidth: 150,
                }}
                max={100}
                placeholder='输入检测结果(%)'
                value={value[key] && value[key].value || ''}
                onChange={(value) => {
                  change(value);
                }} /></Space></div>
          </div>;
        case 5:
          return <UpLoadImg disabled={disabled} value={value[key] && value[key].value || ''} onChange={(value) => {
            change(value);
          }} />;
        default:
          break;
      }
    } else {
      return null;
    }

  };

  if (!data) {
    return null;
  }


  // 上传图片
  const imgs = () => {

    if (state[key]) {
      if (value[key] && value[key].imgValues) {
        return <>
          <WhiteSpace size='sm' />
          <span style={{
            fontSize: 16,
          }}>拍照 / 录像：</span>
          <div style={{ padding: 8 }}>
            <ImgUpload
              loading={imgloading}
              value={value[key] && value[key].imgValues}
              disabled={state[key]}
              onChange={(value) => {
                change(null, value);
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
            loading={imgloading}
            value={value[key] && value[key].imgValues || []}
            disabled={state[key]}
            onChange={(value) => {
              change(null, value);
            }} />
        </div>
      </>;
    }

  };

  return <div style={{ height: '100vh' }}>
    <Row gutter={24} style={{ height: '100%' }}>
      <Col span={7} style={{ height: '100%', backgroundColor: '#f5f5f5', padding: 0 }}>
        <div style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <SideBar style={{ '--width': '100%', overflowY: 'auto', overflowX: 'hidden' }} activeKey={key}
                   onChange={(value) => {
                     toggle();
                     setPlan(data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[value]);
                     setKey(value);
                   }}>
            {
              data
              &&
              data.qualityPlanResult
              &&
              data.qualityPlanResult.qualityPlanDetailParams
              &&
              data.qualityPlanResult.qualityPlanDetailParams.map((items, index) => {
                return <SideBar.Item
                  key={index}
                  className={style.sidebar}
                  badge={!state[index] && Badge.dot}
                  title={
                    <Space style={{ width: '100%' }} className={style.space}>
                      <div style={{ width: '100%', display: 'inline-block' }}>
                        <Ellipsis
                          rows={1}
                          style={{ fontSize: 16 }}
                          direction='end'
                          content={items.qualityCheckResult && items.qualityCheckResult.name} />
                      </div>
                      <div style={{ display: 'inline-block', width: '20%' }}>
                        {state[index] && res(!!state[index].judge)}
                      </div>
                    </Space>} />;
              })
            }
          </SideBar>
        </div>
      </Col>
      <Col span={16} style={{ padding: 8, maxHeight: '70%',overflowY: 'auto', overflowX: 'hidden' }}>
        <Card
          title={<>
            {
              plan.isNull === 1
              &&
              <span style={{ color: 'red', marginRight: 4 }}>*</span>
            }
            <Ellipsis style={{display:'inline-block'}} direction='end' content={
              '质检项：' + (plan.qualityCheckResult && plan.qualityCheckResult.name)
            } />
          </>

          }
          headerStyle={{ borderLeft: 'solid 4px #000', padding: 8 }}>
          {bars(state[key])}
          {imgs()}
          <WhiteSpace size='sm' />
          <div>
            <Button
              disabled={state[key]}
              color='primary'
              block
              shape='rounded'
              style={{ backgroundColor: '#4B8BF5', width: '100%', borderRadius: 50 }}
              onClick={() => {
                if (plan.qualityCheckResult && plan.qualityCheckResult.type) {

                  const judge = getJudge(value[key] && value[key].values, key);

                  const count = sysState(value[key] || '', judge);
                  if (count === true) {
                    toggle();
                    setKey(`${parseInt(key) + 1}`);
                    setPlan(data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[parseInt(key) + 1]);
                  }

                }
              }}>下一项</Button>
          </div>
        </Card>

        <Divider>其他信息</Divider>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>供应商 / 品牌：{data.brand && data.brand.brandName}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>数量：{batch ? number : 1}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>检查类型：{batch ? '抽检' : '固定检查'}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>质检人：</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>质检地点：{data.address}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>质检时间：{data.time}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>接头人：{data.person}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>联系方式：{data.phone}</span>
        </div>
        <WhiteSpace size='sm' />
        <div>
          <span style={{ fontSize: 16, color: '#999' }}>备注：{data.note}</span>
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
      </Col>
    </Row>

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
            width: '60%',
            backgroundColor: '#f2b321',
            color: '#fff',
            borderRadius: 0,
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          }}
          disabled={data.inkindId ? (data.inkindId.split(',')[index] || bind) : bind}
          onClick={() => {
            scan({ brandId: data.brandId, skuId: data.skuId });
          }}><ScanOutlined />绑定当前物料</Button>
        <Button
          style={{
            padding: 8,
            width: '40%',
            backgroundColor: '#4B8BF5',
            borderRadius: 0,
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
          }}
          loading={loading}
          color='primary'
          disabled={values && values.key !== undefined}
          onClick={() => {
            if (data.inkindId ? (data.inkindId.split(',')[index] || bind) : bind) {
              if (state.length === data.qualityPlanResult.qualityPlanDetailParams.length) {
                const valueNull = state.filter((value) => {
                  return value || value === '';
                });
                if (valueNull.length === data.qualityPlanResult.qualityPlanDetailParams.length) {
                  comlete(state);
                } else {
                  Toast.show({
                    content: '请全部检验完成！',
                  });
                }
              } else {
                Toast.show({
                  content: '请全部检验完成！',
                });
              }
            } else {
              Toast.show({
                content: '请绑定该物料！',
              });
            }
          }}>
          检验完成
        </Button>
      </div>
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>
  </div>;
};

export default QualitySidBar;
