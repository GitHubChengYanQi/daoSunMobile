import React, { useState } from 'react';
import { Button, Card, Checkbox,  Divider, Empty, List, SafeArea, Space, Toast } from 'antd-mobile';
import { request, useRequest } from '../../../../util/Request';
import style from './index.css';
import { useDebounceEffect } from 'ahooks';
import Icon from '../../../components/Icon';
import { router } from 'umi';


const DispatchTask = (props) => {

  const query = props.location.query;

  const [qualityTaskDetail, setQualityTaskDtail] = useState({});

  const [check, setCheck] = useState([]);

  const { run: detail } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setQualityTaskDtail({ ...qualityTaskDetail, detail: res });
    },
  });

  // 执行审批接口
  const { run: processLogRun } = useRequest(
    {
      url: '/audit/post',
      method: 'GET',
    },
    {
      manual: true,
    },
  );

  const { run: qualityLising } = useRequest({
    url: '/qualityTaskDetail/list',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      if (res){
        const qualitys = res.filter((value)=>{
          return value.remaining === 0
        })
        if (qualitys.length === res.length){
          processLogRun({
            params: {
              taskId: query.id,
              status: 1,
            },
          });
        }
        setQualityTaskDtail({ ...qualityTaskDetail, qualityLising: res });
      }
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
  }, [], {
    wait: 0,
  });

  return <>
    <Card title='质检任务分派' bodyStyle={{ padding: 0, overflowX: 'hidden' }}>
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
                  return <div key={index}>
                    <Checkbox
                      icon={(check) => {
                        if (items.remaining <= 0) {
                          return <Icon type='icon-fangxingxuanzhongfill' style={{ color: '#dcdcdc' }} />;
                        } else {
                          if (check) {
                            return <Icon type='icon-duoxuanxuanzhong1' />;
                          } else {
                            return <Icon type='icon-duoxuanxuanzhong' style={{ color: '#666' }} />;
                          }
                        }
                      }}
                      className={style.checkBox}
                      style={{ width: '100%', padding: 8 }}
                      disabled={items.remaining <= 0}
                      value={items}>
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
                      <div>
                        {items.brand && items.brand.brandName}
                        &nbsp;&nbsp;
                        <strong>
                          ×
                          {items.remaining}
                        </strong>
                      </div>
                    </Checkbox>
                    <Divider style={{ margin: 0, marginTop: 8 }} />
                  </div>;
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
          disabled={check.length === 0}
          onClick={() => {
            router.push({
              pathname: '/Work/Workflow/DispatchTask/EditChildTask',
              state: {
                detail: { ...qualityTaskDetail,qualityLising:check },
                taskId:query.id,
              },
            });
          }}>
          分派
        </Button>
      </div>
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>

  </>;

};

export default DispatchTask;
