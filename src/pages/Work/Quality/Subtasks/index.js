import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { qualityTaskDetailEdit } from '../../Workflow/DispatchTask/components/URL';
import { Button, Collapse, Empty, List, SafeArea, Space, Toast } from 'antd-mobile';
import LinkButton from '../../../components/LinkButton';
import { router } from 'umi';
import ScanCodeBind from '../../../Scan/ScanCodeBind';
import CreateInstock from '../CreateInstock';
import { useDebounceEffect } from 'ahooks';

const Subtasks = ({ id }) => {

  // 打开入库操作页面
  const [show, setShow] = useState(false);

  // 入库的实物
  const { run: inkind } = useRequest({
    url: '/qualityTask/inStockDetail',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setShow(res);
    },
  });

  const { run: addData } = useRequest(
    {
      url: '/qualityTask/addData',
      method: 'POST',
    },
    {
      manual: true,
    },
  );

  const { loading, run: childTaskState } = useRequest(
    {
      url: '/qualityTask/updateChildTask',
      method: 'GET',
    },
    {
      manual: true,
    },
  );

  const { data, run } = useRequest({
    url: '/qualityTask/backChildTask',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {

      if (res.details) {
        // 判断子任务是否全部完成
        const complete = res.details.filter((value) => {
          if (value.batch) {
            return Math.ceil(value.number * value.percentum) === value.remaining;
          } else {
            return value.number === value.remaining;
          }
        });

        if (complete.length === res.details.length) {
          childTaskState({
            params: {
              id: res.qualityTaskId,
            },
          });
        }
      }
    },
  });

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

  if (!data || loading) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  return <>
    <Collapse defaultActiveKey={['1', '2']}>
      <Collapse.Panel key='1' title={<>任务信息</>}>
        <List.Item>分派人：<LinkButton style={{ float: 'right', padding: 0 }} title='查看主任务' onClick={() => {
          router.push(`/Work/Quality?id=${data.parentId}`);
        }} /></List.Item>
        <List.Item>分派时间：{data.createTime}</List.Item>
        <List.Item>质检人员：{data.names && data.names.toString()}</List.Item>
        <List.Item>质检地点：{data.address}</List.Item>
        <List.Item>质检时间：{data.time}</List.Item>
        <List.Item>联系人：{data.person}</List.Item>
        <List.Item>联系方式：{data.phone}</List.Item>
        <List.Item>备注：{data.note || '无'}</List.Item>
      </Collapse.Panel>

      <Collapse.Panel key='2' title='质检信息'>
        {
          data.details ?
            data.details.map((items, index) => {

              return <List.Item
                key={index}
                extra={<Space>
                  <>{items.remaining}/{items.batch ? Math.ceil(items.number * items.percentum) : items.number}</>
                  <ScanCodeBind
                    complete={items.remaining === items.number}
                    batchComplete={items.batch && (items.remaining === Math.ceil(items.number * items.percentum))}
                    bind={items.inkindId && (items.batch ? items.inkindId : items.inkindId.split(',')[items.remaining])}
                    items={items}
                    onBind={async (res) => {
                      // 未绑定的码
                      let ids = [];
                      if (items.inkindId) {
                        ids = items.inkindId.split(',');
                      }
                      ids.push(res);

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
                          qrCodeId: res,
                          maxNumber: 1,
                          planId: items.qualityPlanId,
                        },
                      }).then(() => {
                        // 添加成功跳转到执行质检任务页面
                        router.push({
                          pathname: '/Work/Quality/QualityTask',
                          state: {
                            items,
                            taskDetailId: items.qualityTaskDetailId,
                            codeId: res,
                            id,
                          },
                        });
                      });
                    }}
                    onCodeId={(codeId) => {

                      // 已经绑定过的码
                      const ids = items.inkindId.split(',');

                      const inkindId = ids.filter((value) => {
                        return value === codeId;
                      });

                      if (inkindId.length > 0) {
                        router.push({
                          pathname: '/Work/Quality/QualityTask',
                          state: {
                            items,
                            taskDetailId: items.qualityTaskDetailId,
                            codeId,
                            id,
                          },
                        });
                      } else {
                        Toast.show({
                          content: '二维码已绑定其他物料，请重新选择!',
                        });
                      }

                    }} />
                </Space>}>
                <div onClick={() => {
                  router.push({
                    pathname: '/Work/Quality/Detail',
                    state: {
                      qualityDetails: items,
                    },
                  });
                }}>
                  {items.skuResult && items.skuResult.skuName}
                  &nbsp;/&nbsp;
                  {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
                  &nbsp;&nbsp;
                  {
                    items.skuResult
                    &&
                    items.skuResult.list
                    &&
                    items.skuResult.list.length > 0
                    &&
                    items.skuResult.list[0].attributeValues
                    &&
                    <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                      (
                      {
                        items.skuResult.list.map((items, index) => {
                          return <span key={index}>
                {items.itemAttributeResult.attribute}：{items.attributeValues}
                  </span>;
                        })
                      }
                      )
                    </em>}

                  <br />
                  {items.brand && items.brand.brandName}
                  <br />
                  <Space>
                    {items.qualityPlanResult && items.qualityPlanResult.planName}
                    /
                    <>总数：{items.number}</>
                    /
                    {items.batch ? '抽检' + (items.percentum * 100) + '%' : '固定检查'}
                  </Space>

                </div>
              </List.Item>;
            })

            :
            <Empty
              style={{ padding: '64px 0' }}
              imageStyle={{ width: 128 }}
              description='暂无数据'
            />
        }
      </Collapse.Panel>;
    </Collapse>

    <CreateInstock qualityDeatlis={data.details} show={show} />

    {data.state === 2 && <div style={{
      width: '100%',
      paddingBottom: 0,
      padding: '0 8px',
      position: 'fixed',
      bottom: 0,
      left: 0,
      backgroundColor: '#fff',
    }}>
      <Button
        style={{
          width: '100%',
          backgroundColor: '#4B8BF5',
          borderRadius: 50,
        }}
        color='primary'
        onClick={async () => {
          const array = [];
          data.details.map((items) => {
            if (items.inkindId) {
              return items.inkindId.split(',').map((items) => {
                return array.push(items);
              });
            }
            return null;
          });
          await inkind({
            data: {
              qrcodeIds: array,
            },
          });
        }}
      >
        入库
      </Button>
      <SafeArea position='bottom' />
    </div>}
  </>;

};

export default Subtasks;
