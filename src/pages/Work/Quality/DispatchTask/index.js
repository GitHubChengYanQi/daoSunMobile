import React, { useState } from 'react';
import {  Checkbox, Collapse, Dialog, List, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import style from './index.css';
import { useDebounceEffect } from 'ahooks';
import Icon from '../../../components/Icon';
import { history } from 'umi';
import { Skeleton } from 'weui-react-v2';
import MyEmpty from '../../../components/MyEmpty';
import LinkButton from '../../../components/LinkButton';
import { ProfileOutlined } from '@ant-design/icons';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import BottomButton from '../../../components/BottomButton';


const DispatchTask = ({ taskDetail }) => {

  const [check, setCheck] = useState([]);

  // 指派信息
  const { loading: disoatchLoading, run: dispatchRun } = useRequest({
    url: '/qualityTaskDetail/getDetailResults',
    method: 'GET',
  }, {
    manual: true,
  });


  const { loading, data, run } = useRequest({
    url: '/qualityTaskDetail/list',
    method: 'POST',
  }, {
    manual: true,
  });

  useDebounceEffect(() => {
    if (taskDetail && taskDetail.qualityTaskId) {
      run({
        data: {
          qualityTaskId: taskDetail.qualityTaskId,
        },
      });
    }
  }, [], {
    wait: 0,
  });

  const sku = (items) => {
    return <SkuResultSkuJsons skuResult={items.skuResult} />;
  };

  const dispatchDetails = async (id, items) => {
    const data = await dispatchRun({
      params: {
        id,
      },
    });

    const details = [];
    // 指派
    data.detailResults
    &&
    data.detailResults.map((items) => {
      return details.push({
        createUser: items.qualityTaskResult && items.qualityTaskResult.user && items.qualityTaskResult.user.name,
        users: items.qualityTaskResult && items.qualityTaskResult.user && items.qualityTaskResult.users.map((items) => {
          return items.name;
        }).toString(),
        number: items.number,
        dispatch: true,
        time: items.qualityTaskResult && items.qualityTaskResult.createTime,
      });
    });

    // 驳回
    data.refuseResults
    &&
    data.refuseResults.map((items) => {
      return details.push({
        createUser: items.user && items.user.name,
        number: items.number,
        dispatch: false,
        time: items && items.createTime,
      });
    });

    details.sort((a, b) => a.time.localeCompare(b.time));

    Dialog.alert(
      {
        title: sku(items),
        content: disoatchLoading ?
          <Skeleton loading={disoatchLoading} />
          :
          details && details.length > 0 ?
            details.map((items, index) => {
              if (items) {
                return <List.Item
                  title={items.time}
                  key={index}>
                  {
                    items.dispatch ?
                      <>
                        {items.createUser}给{items.users}指派了{items.number}个
                      </>
                      :
                      <>
                        {items.createUser}驳回了{items.number}个
                      </>
                  }
                </List.Item>;
              } else {
                return null;
              }
            })
            :
            <MyEmpty />,
      },
    );
  };

  if (loading) {
    return <Skeleton loading={loading} />;
  }

  if (!data || data.length === 0) {
    return <MyEmpty />;
  }

  return <>
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel key='1' title={<>指派子任务</>}>
          <List
            style={{
              '--border-top':'none',
              '--border-bottom':'none',
          }}
          >
            <Checkbox.Group
              value={check}
              onChange={(value) => {
                setCheck(value);
              }}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                {data.map((items, index) => {
                  return <div key={index}>
                    <Checkbox
                      icon={(check) => {
                        if (items.remaining <= 0) {
                          return <Icon type='icon-fangxingxuanzhongfill' style={{ color: '#dcdcdc' }} />;
                        } else {
                          if (check) {
                            return <Icon type='icon-duoxuanxuanzhong1' />;
                          } else {
                            return <Icon type='icon-a-44-110' style={{ color: '#666' }} />;
                          }
                        }
                      }}
                      className={style.checkBox}
                      style={{ width: '100%', padding: 8 }}
                      disabled={items.remaining <= 0}
                      value={items}>
                      <List.Item
                        title={<div style={{ color: '#000' }}>
                          {sku(items)}
                        </div>}
                        extra={
                          <Space style={{ marginRight: 8 }}>
                            <span>{items.remaining} / {items.number}</span>
                            <LinkButton title={<ProfileOutlined />} onClick={() => {
                              dispatchDetails(items.qualityTaskDetailId, items);
                            }} />
                          </Space>
                        }
                        description={
                          <div>{items.qualityPlanResult && (items.qualityPlanResult.planName + '  /  ' + (items.skuResult && items.skuResult.batch ? `抽检 ${(items.percentum || 1) * 100}%` : '固定检查'))}</div>
                        }
                      >
                        <div>品牌：{items.brand && items.brand.brandName}</div>
                        <div>供应商：{items.customerResult && items.customerResult.customerName}</div>
                      </List.Item>
                    </Checkbox>
                  </div>;
                })}
              </Space>
            </Checkbox.Group>
          </List>
        </Collapse.Panel>
      </Collapse>
    </div>
    {check.length !== 0 && <BottomButton
      leftOnClick={() => {
        history.push({
          pathname: '/Work/Quality/DispatchTask/EditChildTask',
          state: {
            action: 'refuse',
            detail: { detail: { ...taskDetail }, qualityLising: check },
          },
        });
      }}
      leftText='驳回'
      rightOnClick={() => {
        history.push({
          pathname: '/Work/Quality/DispatchTask/EditChildTask',
          state: {
            action: 'agree',
            detail: { detail: { ...taskDetail }, qualityLising: check },
          },
        });
      }}
      rightText='指派'
    />}
  </>;

};

export default DispatchTask;
