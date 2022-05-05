import React from 'react';
import CreateInStock from '../../../Instock/CreateInStock';
import { Button, Space } from 'antd-mobile';
import Audit from '../Audit';

export const CreateInstock = (
  {
    query,
    createRef,
    setModuleObject,
  }) => {


  return <>
    <CreateInStock
      source={query.source}
      sourceId={query.sourceId}
      paramsSkus={query.skus && JSON.parse(query.skus)}
      ref={createRef}
      setModuleObject={setModuleObject}
    />
  </>;
};

export const CreateInstockBottom = (
  {
    left,
    createRef,
    moduleObject,
    isCreate,
    detail,
    id,
    refresh,
  }) => {

  const skus = moduleObject.skus || [];

  if (left) {
    return isCreate ? <div>合计：{skus.length}</div> : <></>;
  }

  return isCreate ? <Space>
      <Button>扫码添加物料</Button>
      <Button
        disabled={skus.length === 0 || skus.filter(item => item.number > 0).length !== skus.length}
        color='primary'
        onClick={() => {
          createRef.current.submit();
        }}>提交申请</Button>
    </Space>
    :
    <>
      <Audit detail={detail} id={id} refresh={refresh} />
    </>;
};
