import React from 'react';
import { Button, Space } from 'antd-mobile';
import Audit from '../Audit';
import CreateInStock from '../../../Work/Instock/CreateInStock';
import Label from '../../../components/Label';
import { ReceiptAction } from '../../index';

export const CreateInstock = (
  {
    query,
    createRef,
    setModuleObject,
    setType,
  }) => {


  return <>
    <CreateInStock
      source={query.source}
      sourceId={query.sourceId}
      paramsSkus={query.skus && JSON.parse(query.skus)}
      ref={createRef}
      setModuleObject={setModuleObject}
      setType={setType}
    />
  </>;
};

export const CreateInstockBottom = (
  {
    left,
    createRef,
    moduleObject = {},
  }) => {

  const skus = moduleObject.skus || [];

  if (left) {
    return <div>合计：{skus.length}</div>;
  }

  return <Space>
    <Button>扫码添加物料</Button>
    <Button
      disabled={skus.length === 0 || skus.filter(item => item.number > 0).length !== skus.length}
      color='primary'
      onClick={() => {
        createRef.current.submit();
      }}>提交申请</Button>
  </Space>;
};


export const InstockDetailBottom = (
  {
    left,
    moduleObject = {},
    detail,
    id,
    refresh,
    currentNode = [],
    actionRef,
  }) => {

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push(item);
      });
    }
    return null;
  });

  if (left) {
    return actions.includes(ReceiptAction.errorOrder) && <div>
      <div>计划 / 实际</div>
      <div>
        {moduleObject.number} /
        <span
          style={{ color: moduleObject.number === moduleObject.newNumber ? 'blue' : 'red' }}>
              {moduleObject.newNumber}
            </span>
      </div>
    </div>;
  }

  const buttons = () => {
    return <Space>
      <Audit detail={detail} id={id} refresh={refresh} />
      {
        actions.map((item, index) => {
          switch (item.action) {
            case ReceiptAction.errorOrder:
              return <Button
                key={index}
                color='primary'
                fill='outline'
                onClick={() => {
                  actionRef.current.errorAction(item.documentsActionId);
                }}
              >核实数量
              </Button>;
            case ReceiptAction.inStockAction:
              return <Button
                key={index}
                color='primary'
                fill='outline'
                onClick={() => {
                  actionRef.current.instockAction({ actionId: item.documentsActionId });
                }}
              >批量入库</Button>;
            default:
              return <div key={index} />;
          }
        })
      }
    </Space>;
  };

  return buttons();
};

export const InstockError = (
  {
    left,
    createRef,
    moduleObject = {},
  }) => {

  const errorDetails = moduleObject.errorDetails || [];

  if (left) {
    return <div><Label>异常物料：</Label>{errorDetails.length}</div>;
  }

  return <Space>
    <Button
      disabled={errorDetails.length === 0}
      color='primary'
      onClick={() => {
        createRef.current.submitAnomaly();
      }}>提交并暂停入库</Button>
  </Space>;
};
