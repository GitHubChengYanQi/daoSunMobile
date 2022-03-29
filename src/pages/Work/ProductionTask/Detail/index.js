import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail, productionTaskGetPickCode } from '../../Production/components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card, Dialog, List, Space, Tabs } from 'antd-mobile';
import styles from '../../Production/index.css';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import BottomButton from '../../../components/BottomButton';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEllipsis from '../../../components/MyEllipsis';
import ReportWork from './components/ReportWork';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import { getHeader } from '../../../components/GetHeader';
import Pick from '../../Production/Pick';

const Detail = (props) => {
  const params = props.location.query;

  const [visible, setVisible] = useState();

  const { loading, data, run, refresh } = useRequest(productionTaskDetail, { manual: true });

  const { loading: codeLoading, run: getCode } = useRequest(productionTaskGetPickCode, {
    manual: true,
    onSuccess: (res) => {
      Dialog.alert({
        title: '领料码',
        content: <div style={{ textAlign: 'center' }}>{res}</div>,
        confirmText: '确定',
      });
    },
  });

  const setpSetResult = data
    &&
    data.workOrderResult
    &&
    data.workOrderResult.setpSetResult
    &&
    data.workOrderResult.setpSetResult.shipSetpResult
    &&
    data.workOrderResult.setpSetResult || {};

  const shipSetpResult = setpSetResult.shipSetpResult || {};

  const setpSetDetails = setpSetResult.setpSetDetails
    &&
    setpSetResult.setpSetDetails.map((skuItems) => {
      const jobBooking = data.taskDetailResults.filter((item) => {
        return item.jobBookingDetailCount && (item.jobBookingDetailCount.skuId = skuItems.skuId);
      });
      return {
        ...skuItems,
        jobBookNumber: jobBooking
          &&
          jobBooking.length === 1
          &&
          jobBooking[0].jobBookingDetailCount
          &&
          jobBooking[0].jobBookingDetailCount.number
          ||
          0,
      };
    })
    ||
    [];

  const [key, setKey] = useState('out');

  useEffect(() => {
    if (params.id) {
      run({ data: { productionTaskId: params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const status = (state) => {
    switch (state) {
      case 0:
        return <Space style={{ color: '#ffa52a' }}><QuestionCircleOutline />待领取</Space>;
      case 98:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
      case 99:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return '';
    }
  };

  const backgroundDom = () => {

    return <Card
      title={<div><Label>工序：</Label>{shipSetpResult.shipSetpName}</div>}
      className={styles.mainDiv}
      style={{ backgroundColor: '#fff' }}>
      <Space direction='vertical'>
        <div>
          <Label>任务编码：</Label>{data.coding}
        </div>
        <div>
          <Label>任务状态：</Label>{status(data.status)}
        </div>
        <div>
          <Label>执行数量：</Label> {data.number}
        </div>
        <div>
          <Label>标准作业指导：</Label>{shipSetpResult.sopResult && shipSetpResult.sopResult.name}
        </div>
        <div>
          <Label>执行时间：</Label>{data.productionTime}
        </div>
        <div>
          <Label>结束时间：</Label>{data.endTime}
        </div>
        <div>
          <Label>负责人：</Label>{data.userResult && data.userResult.name}
        </div>
        <div>
          <Label>成员：</Label>{data.userResults && data.userResults.map((item) => {
          return item.name;
        }).join(',')}
        </div>
        <div>
          <Label>分派人：</Label>{data.createUserResult && data.createUserResult.name}
        </div>
        <div>
          <Label>分派时间：</Label>{data.createTime}
        </div>
        <div>
          <Label>备注：</Label>{data.remark}
        </div>
      </Space>
    </Card>;
  };

  const module = () => {
    switch (key) {
      case 'out':
        return setpSetDetails.length === 0
          ?
          <MyEmpty />
          :
          <List>
            {
              setpSetDetails.map((item, index) => {
                const skuResult = item.skuResult || {};
                return <List.Item key={index}>
                  <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
                  <div>
                    <Label>描述：</Label>
                    <MyEllipsis width='80%'><SkuResult_skuJsons skuResult={skuResult} describe /></MyEllipsis>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1, color: 'green' }}>
                      <Label>已报工：</Label>{item.jobBookNumber}
                    </div>
                    <div style={{ flexGrow: 1, color: 'var(--adm-color-primary)' }}>
                      <Label>生产数：</Label>{item.num * data.number}
                    </div>

                  </div>
                </List.Item>;
              })
            }
          </List>;
      case 'in':
        return <Pick module='task' id={params.id} />;
      case 'use':
        return <MyEmpty />;
      default:
        return <></>;
    }
  };

  const bottonText = () => {
    switch (key) {
      case 'out':
        return data.status === 99 ? '已完成' : '产出报工';
      case 'in':
        return '获取领料码';
      default:
        return '确认';
    }
  };

  return <div>
    <MyNavBar title='任务详情' />
    <div>
      <MyFloatingPanel
        backgroundColor
        maxHeight={window.innerHeight - (getHeader() ? 52 : 97)}
        backgroundDom={backgroundDom()}
      >
        <Tabs
          activeKey={key}
          style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
          onChange={setKey}
        >
          <Tabs.Tab title='产出明细' key='out' />
          <Tabs.Tab title='投入明细' key='in' />
          <Tabs.Tab title='领用明细' key='use' />
        </Tabs>
        <div style={{ backgroundColor: '#eee' }}>
          {module()}
        </div>
      </MyFloatingPanel>
    </div>

    <BottomButton
      only
      disabled={data.status === 99}
      text={bottonText()}
      onClick={() => {
        switch (key) {
          case 'out':
            setVisible(true);
            break;
          case 'in':
            getCode({
              data: {
                productionTaskId: params.id,
              },
            });
            break;
          default:
            break;
        }
      }} />

    <ReportWork
      productionTaskId={params.id}
      skuData={setpSetDetails.map((item) => {
        return {
          ...item,
          maxNumber: (item.num * data.number) - item.jobBookNumber,
        };
      })}
      setVisible={setVisible}
      visible={visible}
      onSuccess={() => {
        setVisible(false);
        refresh();
      }}
    />

    {codeLoading && <MyLoading />}

  </div>;
};

export default Detail;
