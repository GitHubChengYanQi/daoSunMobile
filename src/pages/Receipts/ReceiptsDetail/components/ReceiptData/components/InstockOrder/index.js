import React, { useState } from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { Upload } from 'antd';
import SkuAction from './components/SkuAction';
import { ReceiptsEnums } from '../../../../../index';
import OutSkuAction from '../OutStockOrder/components/OutSkuAction';
import { ActionSheet } from 'antd-mobile';

const InstockOrder = (
  {
    data = {},
    currentNode = [],
    refresh = () => {
    },
    loading,
    permissions,
    type,
  }) => {

  let details = [];

  switch (type) {
    case ReceiptsEnums.instockOrder:
      details = ToolUtil.isArray(data.instockListResults).filter(item => item.status === 0);
      break;
    case ReceiptsEnums.outstockOrder:
      details = ToolUtil.isArray(data.detailResults);
      break;
    default:
      break;
  }

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push({ action: item.action, id: item.documentsActionId });
      });
    }
    return null;
  });

  const getAction = (action) => {
    const actionData = actions.filter(item => {
      return item.action === action;
    });
    return actionData[0] || {};
  };

  const action = () => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return <SkuAction
          loading={loading}
          data={details}
          actionId={getAction('performInstock').id}
          action={getAction('performInstock').id && permissions}
          instockOrderId={data.instockOrderId}
          refresh={refresh}
        />;
      case ReceiptsEnums.outstockOrder:
        return <OutSkuAction
          loading={loading}
          data={details}
          actionId={getAction('stockPreparation').id}
          action={getAction('stockPreparation').id && permissions}
          outStockOrderId={data.instockOrderId}
          refresh={refresh}
        />;
      default:
        return <></>;
    }
  };


  return <>
    <div className={style.skus}>
      {action()}
    </div>

    <div className={style.careful}>
      <div className={style.title}>注意事项</div>

    </div>

    <div className={style.note}>
      <div className={style.title}>备注说明</div>
      <span className={style.remake}>{data.remark || '-'}</span>
    </div>

    <div className={style.file}>
      <div className={style.title}>附件</div>
      <div className={style.files}>
        <Upload
          showUploadList={{
            showRemoveIcon: false,
          }}
          className='avatar-uploader'
          fileList={ToolUtil.isArray(data.url).map(item => {
            return {
              url: item,
            };
          })}
          listType='picture'
        />
      </div>
    </div>
  </>;
};

export default InstockOrder;
