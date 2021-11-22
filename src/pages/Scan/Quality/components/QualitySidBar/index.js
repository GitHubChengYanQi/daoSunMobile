import { Col, Row } from 'antd';
import { Badge, Button, Card, Dialog,  Radio, SideBar, Space, Toast } from 'antd-mobile';
import { CheckOutlined, CloseOutlined, ScanOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { NumberInput, TextArea, WhiteSpace } from 'weui-react-v2';
import UpLoadImg from '../../../../components/Upload';
import { request } from '../../../../../util/Request';
import wx from 'populee-weixin-js-sdk';

const testCodeId = '1461996335041687553';

const QualitySidBar = ({ data, batch, taskId, values,create, number, onChange, defaultValue }) => {

  // 侧边导航的key
  const [key, setKey] = useState('0');

  // 绑定的二维码id
  const [bind, setBind] = useState(values && values.bind);

  //当前选中的质检项 {}
  const [plan, setPlan] = useState(data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[key]);

  //记录填入的值 【】
  const [value, setValue] = useState((values && values.values && values.values.map((items) => {
    return items && items.values;
  })) || []);

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
              inkindType:'质检',
            },
          }).then((res) => {
            if (typeof res === 'string') {
              setBind(res);
              typeof defaultValue === 'function' && defaultValue({
                bind: res,
                res: values && values.res,
                values: state,
              });
              Toast.show({
                content: '绑定成功！',
              });
            }
          });

        } else {
          // typeof onChange === 'function' && onChange();
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
      return <>&nbsp;&nbsp;<CheckOutlined style={{ color: 'green' }} /></>;
    } else if (value === false) {
      return <>&nbsp;&nbsp;<CloseOutlined style={{ color: 'red' }} /></>;
    } else {
      return null;
    }
  };


  // 记录验收值的集合
  const change = (val) => {

    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = val;

    setValue(arrs);
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
        value: arrs[index].values,
      };
    });

    await request({
      url: '/qualityTask/addData',
      method: 'POST',
      data: {
        taskId,
        formId: bind,
        formValues,
        module: 'item',
        number: batch ? number : 1,
        qualityTaskDetailId:data.qualityTaskDetailId
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


  const bars = () => {

    if (plan) {
      const Operator = (value,bai) => {
        switch (value) {
          case 1:
            return <>{'='}{plan.standardValue}{bai && '%'}</>;
          case 2:
            return <>{'>='}{plan.standardValue}{bai && '%'}</>;
          case 3:
            return <>{'<='}{plan.standardValue}{bai && '%'}</>;
          case 4:
            return <>{'>'}{plan.standardValue}{bai && '%'}</>;
          case 5:
            return <>{'<'}{plan.standardValue}{bai && '%'}</>;
          case 6:
            return <>{`\< ${plan.standardValue.split(',')[0]}`} {`${bai ? '%' : ''}`}            {`\> ${plan.standardValue.split(',')[1]}`} {`${bai ? '%' : ''}`}</>;
          default:
            break;
        }
      };
      switch (plan.qualityCheckResult && plan.qualityCheckResult.type) {
        case 1:
          return <div>
            <div><strong>合格标准：</strong>{Operator(plan.operator)} &nbsp;&nbsp;&nbsp;&nbsp; {plan.unit && plan.unit.unitName}</div>
            <WhiteSpace size='sm' />
            <div><Space><strong>检测结果：</strong>
              <NumberInput
                placeholder='输入验收值'
                value={value[key] || ''}
                onChange={(val) => {
                  change(val);
                }} /></Space></div>
          </div>;
        case 2:
          return <div>
            <TextArea
              placeholder='输入文本'
              value={value[key] || ''}
              onChange={(val) => {
                change(val);
              }} />
          </div>;
        case 3:
          return <div>
            <Radio.Group value={value[key] || ''} onChange={(val) => {
              change(val);
            }}>
              <Space direction='horizontal'>
                <Radio value='1'>合格</Radio>
                <Radio value='0'>不合格</Radio>
              </Space>
            </Radio.Group>
          </div>;
        case 4:
          return <UpLoadImg value={value[key]} onChange={(value) => {
            change(value);
          }} />;
        case 5:
          return <div>
            <div><strong>合格标准：</strong>{Operator(plan.operator,true)}</div>
            <WhiteSpace size='sm' />
            <div><Space><strong>检测结果：</strong>
              <NumberInput
                min={0}
                max={100}
                placeholder='输入验收值(%)'
                value={value[key] || ''}
                onChange={(value) => {
                  change(value);
                }} /></Space></div>
          </div>;
        case 6:
          return <UpLoadImg value={value[key] || ''} onChange={(value) => {
            change(value);
          }} />;
        case 7:
          return <UpLoadImg value={value[key] || ''} onChange={(value) => {
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


  return <div style={{ height: '100vh' }}><Row gutter={24}>
    <Col span={9} style={{ maxHeight: '70vh', overflow: 'auto' }}>
      <SideBar style={{ '--width': '100%' }} activeKey={key} onChange={(value) => {
        // setValue(null);
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
              badge={!state[index] && Badge.dot}
              title={<>{items.qualityCheckResult && items.qualityCheckResult.name}{state[index] && res(!!state[index].judge)}</>} />;
          })
        }
      </SideBar>
    </Col>
    <Col span={15} style={{ padding: 8 }}>
      <WhiteSpace size='sm' />
      <WhiteSpace size='sm' />
      <div><strong>供应商 / 品牌：</strong>{data.brand && data.brand.brandName}</div>
      <WhiteSpace size='sm' />
      <div><strong>数量：</strong>{batch ? number : 1}</div>
      <WhiteSpace size='sm' />
      {bars()}
      <WhiteSpace size='sm' />
      {
        !state[key]
        &&
        <Button color='primary' fill='none' style={{ float: 'right' }} onClick={() => {

          if (plan.qualityCheckResult && plan.qualityCheckResult.type) {
            let judge = true;

            if (plan.isNull === 0 || value[key]) {

              if (value[key]){
                switch (plan.qualityCheckResult && plan.qualityCheckResult.type) {
                  case 3:
                    judge = value[key] === '1';
                    break;
                  case 1:
                  case 5:
                    switch (plan.operator) {
                      case 1:
                        judge = value[key] === parseInt(plan.standardValue);
                        break;
                      case 2:
                        judge = value[key] >= parseInt(plan.standardValue);
                        break;
                      case 3:
                        judge = value[key] <= parseInt(plan.standardValue);
                        break;
                      case 4:
                        judge = value[key] > parseInt(plan.standardValue);
                        break;
                      case 5:
                        judge = value[key] < parseInt(plan.standardValue);
                        break;
                      case 6:
                        judge = value[key] > parseInt(plan.standardValue.split(',')[0]) && value[key] < parseInt(plan.standardValue.split(',')[1]);
                        break;
                      default:
                        break;
                    }
                    break;
                  default:
                    break;
                }
              }

              const count = sysState(value[key] || '', judge);
              if (count === true) {
                setKey(`${parseInt(key) + 1}`);
                setPlan(data.qualityPlanResult && data.qualityPlanResult.qualityPlanDetailParams[parseInt(key) + 1]);
              }

            } else {
              Toast.show({
                content: '请输入检测结果',
                icon: 'fail',
              });
            }
          }

        }}>确定</Button>}
      <WhiteSpace size='sm' />
      <div style={{marginTop:16}}>
        <strong>规范:</strong>{plan && plan.qualityCheckResult && plan.qualityCheckResult.norm}
      </div>
    </Col>
  </Row>
    <div style={{ position: 'fixed', bottom: 0 }}>
      <Card title={
        <Space align='center'>
          <Card title={<Button onClick={() => {
            typeof create === 'function' && create();
          }}>提交入库</Button>} />
          <Button disabled={bind} onClick={() => {
            scan({ brandId: data.brandId, skuId: data.skuId });
          }}><ScanOutlined />绑定当前物料</Button>
          <Button color='primary' disabled={values && values.key !== undefined} onClick={() => {
            if (bind) {
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
          }}>检验完成</Button>
        </Space>} />
    </div>
  </div>;
};

export default QualitySidBar;
