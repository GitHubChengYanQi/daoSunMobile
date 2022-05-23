import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail } from '../../Production/components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card,  List, Space, Tabs } from 'antd-mobile';
import styles from '../../Production/index.css';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import BottomButton from '../../../components/BottomButton';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEllipsis from '../../../components/MyEllipsis';
import ReportWork from './components/ReportWork';
import Pick from '../../Production/Pick';
import { history } from 'umi';
import { ToolUtil } from '../../../components/ToolUtil';

const Detail = (props) => {
  const params = props.location.query;

  const [visible, setVisible] = useState();

  const [disabled, setDisabled] = useState(true);

  const { loading, data, run, refresh } = useRequest(productionTaskDetail, {
    manual: true,
    onSuccess: (res) => {
      setDisabled(res.status === 99);
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
        return item.jobBookingDetailCount && (item.jobBookingDetailCount.skuId === skuItems.skuId);
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
        return <Space style={{ color: '#ffa52a' }}>待领取</Space>;
      case 98:
        return <Space style={{ color: 'blue' }}>执行中</Space>;
      case 99:
        return <Space style={{ color: 'green' }}>已完成</Space>;
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
                  <div style={{ display: 'flex', fontSize: '4vw' }}>
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

  const bottomBotton = () => {
    switch (key) {
      case 'out':
        return <BottomButton
          only
          disabled={disabled}
          text={data.status === 99 ? '已完成' : '产出报工'}
          right
          onClick={() => {
            setVisible(true);
          }} />;
      case 'in':
        return <BottomButton
          only
          text='我的领料'
          leftOnClick={() => {
            history.push('/Work/Production/MyCart');
          }}
        />;
      default:
        return '确认';
    }
  };

  return <div>
    <MyNavBar title='任务详情' />
    <div>
      <MyFloatingPanel
        backgroundColor
        maxHeight={window.innerHeight - (ToolUtil.isQiyeWeixin() ? 52 : 97)}
        backgroundDom={backgroundDom()}
      >
        <Tabs
          activeKey={key}
          style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
          onChange={(key) => {
            switch (key) {
              case 'out':
                setDisabled(data.status === 99);
                break;
              case 'in':
                break;
              default:
                break;
            }
            setKey(key);
          }}
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

    {bottomBotton()}

    <ReportWork
      productionTaskId={params.id}
      skuData={setpSetDetails.map((item) => {
        return {
          ...item,
          maxNumber: (item.num * data.number) - item.jobBookNumber,
        };
      }).filter(item => item.maxNumber > 0)}
      setVisible={setVisible}
      visible={visible}
      onSuccess={() => {
        setVisible(false);
        refresh();
      }}
    />

  </div>;
};

export default Detail;
