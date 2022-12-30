import React, { useEffect, useRef, useState } from 'react';
import { request, useRequest } from '../../../../util/Request';
import {
  Collapse,
  Dialog,
  List,
  Loading,
  SearchBar,
  Space,
  TextArea,
  Toast,
} from 'antd-mobile';
import { history } from 'umi';
import CreateInstock from '../CreateInstock';
import { useDebounceEffect } from 'ahooks';
import MyEmpty from '../../../components/MyEmpty';
import { Skeleton } from 'weui-react-v2';
import { qualityTaskDetailEdit } from '../DispatchTask/components/URL';
import { PlayCircleOutlined, ScanOutlined } from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton';
import SkuResult from '../../../Scan/Sku/components/SkuResult';
import { connect } from 'dva';
import GoToQualityTask from '../GoToQualityTask';
import IsDev from '../../../../components/IsDev';
import ScanCodeBind from '../../../Scan/ScanCodeBind';
import BottomButton from '../../../components/BottomButton';
import { ToolUtil } from '../../../../util/ToolUtil';

const Subtasks = (props) => {

  const { id, qrCode } = props;

  const ref = useRef();

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const createInstockRef = useRef();

  const goToQualityRef = useRef();

  useEffect(() => {
    if (ToolUtil.isQiyeWeixin() && qrCode.codeId) {
      goToQualityRef.current.goToQualityTask(qrCode.codeId);
      clearCode();
    }
  }, [qrCode.codeId]);

  // 当前状态 【-1：驳回,0:新建,1：执行完成，2：入库操作,3:入库完成】
  const [status, setStatus] = useState();

  const [visible, setVisible] = useState(false);

  const [note, setNote] = useState();

  // 当前所有实物
  const [qrCodeIds, setQrCodeIds] = useState([]);

  // 添加data数据
  const { run: addData } = useRequest(
    {
      url: '/qualityTask/addData',
      method: 'POST',
    },
    {
      manual: true,
    },
  );

  // 自动绑定
  const { run: autoBind } = useRequest(
    {
      url: '/orCode/automaticBinding',
      method: 'POST',
    },
    {
      manual: true,
    },
  );


  // 拒绝
  const { run: refuse } = useRequest(
    {
      url: '/qualityTask/childRefuse',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        Toast.show({
          content: '已拒绝',
          position: 'bottom',
        });
        setVisible(false);
        refresh();
      },
    },
  );

  const { loading, data, run, refresh } = useRequest({
    url: '/qualityTask/backChildTask',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {

      if (res.details) {

        // 取出所有当前子任务绑定的二维码
        const codeIds = [];
        res.details.map((item) => {
          if (item.inkindId) {
            item.inkindId.split(',').map((item) => {
              return codeIds.push(item);
            });
          }
          return null;
        });
        setQrCodeIds(codeIds);

        switch (res.state) {
          case -1:
            setStatus(-1);
            break;
          case 1:
            // 指派完成
            const complete = res.details.filter((value) => {
              if (value.batch) {
                return Math.ceil(value.number * value.percentum) === value.remaining;
              } else {
                return value.number === value.remaining;
              }
            });
            // 判断子任务是否全部完成
            if (complete.length === res.details.length) {
              setStatus(1);
            }

            // 判断子任务是否已经是否已经绑定物料
            if (codeIds.length === 0) {
              // 未绑定则可以驳回
              setStatus(0);
            }
            break;
          case 2:
            // 质检完成
            const instocks = res.details.filter((value) => {
              return (value.number - value.instockNumber) === 0;
            });
            // 判断子任务是否全部入库
            if (instocks.length === res.details.length) {
              setStatus(3);
            } else {
              // 未全部入库可以进行入库操作
              setStatus(2);
            }
            break;
          default:
            break;
        }


      }
    },
  });

  const { loading: childTaskStateLoading, run: childTaskState } = useRequest(
    {
      url: '/qualityTask/updateChildTask',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: () => {
        Toast.show({
          content: '上报成功！',
          position: 'bottom',
        });
        refresh();
      },
    },
  );

  const { run: qualityDetailEdit } = useRequest(
    qualityTaskDetailEdit,
    {
      manual: true,
    });

  useDebounceEffect(() => {
    if (id) {
      run({
        params: {
          id,
        },
      });
    }
  }, [], {
    wait: 0,
  });

  const bottomButtonClick = () => {
    switch (status) {
      case 0:
        // 驳回
        setVisible(true);
        break;
      case 1:
        // 上报质检完成
        childTaskState({
          params: {
            id: data.qualityTaskId,
            state: 2,
          },
        });
        break;
      case 2:
        // 入库操作
        createInstockRef.current.setVisible(true);
        break;
      case 3:
        // 上报入库完成
        childTaskState({
          params: {
            id: data.qualityTaskId,
            state: 3,
          },
        });
        break;
      default:
        break;
    }
  };

  const bottomButtonText = () => {
    switch (status) {
      case -1:
        return '已驳回';
      case 0:
        return '驳回';
      case 1:
        return '质检完成上报';
      case 2:
        return '入库';
      case 3:
        return '入库完成上报';
      default:
        break;
    }
  };

  if (loading) {
    return <Skeleton style={{ height: '100vh' }} loading={loading} />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const bindCode = async (codeId, items) => {
    // 未绑定的码
    let ids = [];
    if (items.inkindId) {
      ids = items.inkindId.split(',');
    }
    ids.push(codeId);

    // 任务详情关联二维码
    await qualityDetailEdit({
      data: {
        qualityTaskDetailId: items.qualityTaskDetailId,
        inkindId: ids.toString(),
      },
    });

    // data表添加一条数据
    await addData({
      data: {
        module: 'item',
        qrCodeId: codeId,
        maxNumber: 1,
        planId: items.qualityPlanId,
        qualityTaskId: items.qualityTaskId,
      },
    }).then(() => {
      // 添加成功跳转到执行质检任务页面
      history.push({
        pathname: '/Work/Quality/QualityTask',
        state: {
          items,
          codeId: codeId,
        },
      });
    });
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
              brandId: items.brandId,
              customerId: items.customerId,
              id: items.skuId,
              number: 1,
              inkindType: '质检',
              taskDetailId: items.qualityTaskDetailId,
            },
          }).then(async (res) => {
            if (typeof res === 'string') {
              bindCode(res, items);
              Toast.show({
                content: '绑定成功！',
                position: 'bottom',
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

  return <div style={{paddingBottom:60}}>
    <Collapse defaultActiveKey={['0', '1']}>
      <Collapse.Panel key='0' title='查找二维码'>
        <SearchBar
          placeholder='查找二维码'
          showCancelButton
          style={{
            '--border-radius': '100px',
            '--background': '#ffffff',
          }}
          onFocus={() => {
            history.push({
              pathname: '/Work/Quality/SelectQrCode',
              state: {
                qrCodeIds,
              },
            });
          }}
        />
      </Collapse.Panel>
      <Collapse.Panel key='1' title={<>任务列表</>}>
        <List
          style={{
            '--border-top':'none',
            '--border-bottom':'none',
          }}
        >
          {
            data.details ?
              data.details.map((items, index) => {
                const batch = items.skuResult ? items.skuResult.batch : 0;
                return <List.Item
                  key={index}
                  extra={<Space align='center'>
                    <>{items.remaining}/{batch ? Math.ceil(items.number * items.percentum) : items.number}</>
                    {data.permission && status !== -1
                      &&
                      <Space>
                        {(ToolUtil.isQiyeWeixin() || IsDev()) &&
                          <LinkButton
                            style={{ fontSize: 24 }}
                            onClick={() => {
                              if (batch && (items.remaining === Math.ceil(items.number * items.percentum))) {
                                Toast.show({
                                  content: '该物料已经全部质检完成！',
                                  position: 'bottom',
                                });
                              } else {
                                ref.current.scanCode(items);
                              }
                            }} title={<ScanOutlined />} />}
                        {/* 自动绑定 */}
                        <LinkButton
                          style={{ fontSize: 24 }}
                          disabled={
                            items.remaining === items.number
                            ||
                            items.inkindId && (batch ? items.inkindId : items.inkindId.split(',')[items.remaining])
                          }
                          onClick={async () => {
                            const inkind = await autoBind({
                              data: {
                                sourceId: items.qualityTaskDetailId,
                                source: 'item',
                                brandId: items.brandId,
                                customerId: items.customerId,
                                id: items.skuId,
                                number: 1,
                                inkindType: '质检',
                              },
                            });
                            if (inkind) {
                              bindCode(inkind.codeId, items);
                            }
                          }} title={<PlayCircleOutlined />} />
                      </Space>}
                  </Space>}>
                  <div onClick={() => {
                    history.push({
                      pathname: '/Work/Quality/Detail',
                      state: {
                        qualityDetails: items,
                      },
                    });
                  }}>
                    <SkuResult skuResult={items.skuResult} />
                    <br />
                    {items.brand && items.brand.brandName}
                    <br />
                    <Space>
                      {items.qualityPlanResult && items.qualityPlanResult.planName}
                      /
                      <>总数：{items.number}</>
                      /
                      {items.skuResult && batch ? '抽检' + (items.percentum * 100) + '%' : '固定检查'}
                    </Space>
                  </div>
                </List.Item>;
              })
              :
              <MyEmpty />
          }
        </List>
      </Collapse.Panel>
    </Collapse>

    <CreateInstock qualityDeatlis={data.details} ref={createInstockRef} onSuccess={() => {
      refresh();
      createInstockRef.current.setVisible(false);
    }} />

    <Dialog
      visible={visible}
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
          refuse({
            data: {
              qualityTaskId: data.qualityTaskId,
              note,
            },
          });
        } else {
          setVisible(false);
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

    <ScanCodeBind
      {...props}
      ref={ref}
      action='quality'
      onBind={(codeId, items) => {
        //如果未绑定，提示用户绑定
        if (items.remaining === items.number) {
          Toast.show({
            content: '已经全部质检完成！，不能继续绑定空码啦！',
            position: 'bottom',
          });
        } else {
          if (!items.inkindId && (items.skuResult && items.skuResult.batch ? items.inkindId : items.inkindId.split(',')[items.remaining])) {
            codeBind(codeId, items);
          } else {
            Toast.show({
              content: '请先完成当前质检！',
              position: 'bottom',
            });
          }
        }
        clearCode();
      }}
      onCodeId={(codeId, backObject, items) => {
        // 已经绑定过的码
        const ids = items.inkindId ? `${items.inkindId}`.split(',') : [];

        if (backObject && backObject.type === 'item') {
          const inkindId = ids.includes(`${codeId}`);
          if (inkindId) {
            history.push({
              pathname: '/Work/Quality/QualityTask',
              state: {
                items,
                codeId,
              },
            });
          } else {
            Toast.show({
              content: '二维码已绑定其他物料，请重新选择!',
              position: 'bottom',
            });
          }
        } else {
          Toast.show({
            content: '请扫物料码！',
            position: 'bottom',
          });
        }

        clearCode();
      }} />

    <GoToQualityTask ref={goToQualityRef} type='item' source='质检' codeIds={qrCodeIds} />


    {!(status === undefined || !data.permission) && <BottomButton
      only
      disabled={status === -1 || (status > 0 && !data.isNext)}
      loading={childTaskStateLoading}
      text={bottomButtonText()}
      onClick={() => {
        bottomButtonClick();
      }}
      color={status > 0 ? 'primary' : 'default'}
    />}
  </div>;

};

export default connect(({ qrCode }) => ({ qrCode }))(Subtasks);
