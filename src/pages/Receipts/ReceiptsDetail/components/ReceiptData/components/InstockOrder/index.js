import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { Upload } from 'antd';
import SkuAction from './components/SkuAction';
import { ReceiptsEnums } from '../../../../../index';
import OutSkuAction from '../OutStockOrder/components/OutSkuAction';

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
  let announcementsList = [];
  let remake = '';
  let fileUrls = [];

  switch (type) {
    case ReceiptsEnums.instockOrder:
      details = ToolUtil.isArray(data.instockListResults).filter(item => item.status === 0);
      announcementsList = data.announcementsList;
      remake = ToolUtil.isArray(data.remake)
      fileUrls = ToolUtil.isArray(data.url);
      break;
    case ReceiptsEnums.outstockOrder:
      details = ToolUtil.isArray(data.detailResults).filter(item => item.number > 0);
      announcementsList = data.announcementsResults;
      remake = data.note;
      fileUrls = ToolUtil.isArray(data.enclosureUrl)
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
          pickListsId={data.pickListsId}
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
      <div>
        {ToolUtil.isArray(announcementsList).map((item, index) => {
          return <div key={index} className={style.carefulShow}>
            {item.content}
          </div>;
        })}
      </div>
    </div>

    <div className={style.note}>
      <div className={style.title}>备注说明</div>
      <div className={style.remake}>{remake}</div>
    </div>

    <div className={style.file}>
      <div className={style.title}>附件</div>
      <div className={style.files}>
        <Upload
          showUploadList={{
            showRemoveIcon: false,
          }}
          className='avatar-uploader'
          fileList={fileUrls.map(item => {
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
