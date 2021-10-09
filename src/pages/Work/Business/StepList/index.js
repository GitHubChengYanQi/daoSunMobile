import React, {useEffect, useRef, useState} from 'react';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {Button,Modal as AntModal, notification, Popover, Steps} from 'antd';
import {useRequest} from '@/util/Request';
import { Card, Dialog } from 'antd-mobile';

const {Step} = Steps;

const StepList = (props) => {

  const {value, onChange: pOnChange} = props;

  const ref = useRef(null);

  const contract = () => {

    Dialog.confirm({
      content: '是否创建合同',
      style: {margin: 'auto'},
      onConfirm: async () => {
        // ref.current.open(false);
      },
      onCancel: () => {
        typeof pOnChange === 'function' && pOnChange();
      }
    })
  };

  let current = 0;

  const openNotificationWithIcon = (type, content) => {
    notification[type]({
      message: type === 'success' ? '变更成功！' : '变更失败！',
      description: `变更流程为${content !== undefined ? content : ''}`,
    });

    if (content === '赢单') {
      contract();
    } else {
      typeof pOnChange === 'function' && pOnChange();
    }
  };


  const {data} = useRequest({
    url: '/crmBusinessSalesProcess/list',
    method: 'POST', data: {salesId: value.salesId}
  });


  const {run} = useRequest({
    url: '/crmBusiness/UpdateStatus',
    method: 'POST',
    onError(error) {
      openNotificationWithIcon('error');
    }
  }, {
    manual: true
  });


  const edit = async (salesProcessId, name) => {
    await run(
      {
        data: {
          processId: salesProcessId || null,
          businessId: value.businessId,
          state: name || null,
        }
      }
    );
  };


  const confirm = (name, values) => {
    Dialog.confirm({
      content: `是否变更到${name}`,
      style: {margin: 'auto'},
      onConfirm: async () => {
        await edit(values.salesProcessId);
        await openNotificationWithIcon('success', values.name);
      },
    })
  };

  const confirmOk = (name, percent) => {
    Dialog.confirm({
      content: `是否变更到${name}`,
      style: {margin: 'auto'},
      onConfirm: async () => {
        await edit(null, name);
        openNotificationWithIcon('success', name);
      },
    })
  };


  const step = data ? data.map((values, index) => {
    if (value.processId === values.salesProcessId) {
      current = index;
    };
    return (
      <Step
        disabled={value.state}
        style={{}}
        key={index}
        title={values.name}
        description={`盈率：${values.percentage}%`}
        onClick={async () => {
          value.state || confirm(values.name, values);
        }}
      />
    );

  }) : null;


  if (step) {
    return (
      <Card title="项目销售流程" extra={(!value.contractId && value.state === '赢单') ? <Button type="primary" onClick={() => {
        contract();
      }}>创建合同</Button> : '（点击可变更流程，注意：完成之后不可修改！）'} style={{marginTop:8}}>
        <Steps
          direction='vertical'
          style={{cursor: 'pointer'}}
          type="navigation"
          current={value.state ? step.length : current}
        >
          {step}
          <Step
            onClick={()=>{
              Dialog.show({
                content: '选择',
                closeOnAction:true,
                actions: [
                  {
                    key: 'yes',
                    text: '赢单',
                    onClick:()=>{
                      confirmOk('赢单', 100);
                    }
                  },
                  {
                    key: 'no',
                    text: '输单',
                    onClick:()=>{
                      confirmOk('输单', 0);
                    }
                  },
                  [
                    {
                      key: 'cancel',
                      text: '取消',
                      onClick:()=>{
                      }
                    },
                  ],
                ],
              })
            }}
            title={
              value.state ?value.state :'完成'}
          />
        </Steps>
        {/*<Modal*/}
        {/*  title="合同"*/}
        {/*  width={1200}*/}
        {/*  component={AddContractEdit}*/}
        {/*  customerId={value.customerId}*/}
        {/*  ref={ref}*/}
        {/*  onSuccess={() => {*/}
        {/*    typeof pOnChange === 'function' && pOnChange();*/}
        {/*  }}*/}
        {/*  businessId={value.businessId} />*/}
      </Card>
    );
  } else {
    return null;
  }


};

export default StepList;
