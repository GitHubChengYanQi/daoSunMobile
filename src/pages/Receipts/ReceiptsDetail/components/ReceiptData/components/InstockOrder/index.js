import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { Upload } from 'antd';
import SkuAction from './components/SkuAction';

const InstockOrder = (
  {
    data = {},
    currentNode = [],
    refresh = () => {
    },
    loading,
    permissions,
  }) => {

  const details = ToolUtil.isArray(data.instockListResults).filter(item => item.status === 0);

  let countNumber = 0;
  details.map(item => countNumber += item.number);

  const actions = [];
  currentNode.map((item) => {
    if (item.logResult && Array.isArray(item.logResult.actionResults)) {
      return item.logResult.actionResults.map((item) => {
        return actions.push({action:item.action,id:item.documentsActionId});
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


  return <>
    <div className={style.skus}>
      <SkuAction
        loading={loading}
        data={details}
        actionId={getAction('performInstock').id}
        action={getAction('performInstock').id && permissions}
        instockOrderId={data.instockOrderId}
        refresh={refresh}
      />
    </div>

    <div className={style.careful}>
      <div className={style.title}>注意事项</div>

    </div>

    <div className={style.note}>
      <div className={style.title}>备注说明</div>
      {data.remark || '-'}
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
