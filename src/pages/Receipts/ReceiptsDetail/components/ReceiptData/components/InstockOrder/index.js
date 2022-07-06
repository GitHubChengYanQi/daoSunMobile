import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuAction from './components/SkuAction';
import { ReceiptsEnums } from '../../../../../index';
import OutSkuAction from '../OutStockOrder/components/OutSkuAction';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import Title from '../../../../../../components/Title';

const InstockOrder = (
  {
    data = {},
    refresh = () => {
    },
    loading,
    permissions,
    getAction = () => {
      return {};
    },
    type,
    taskId,
  }) => {

  let details = [];
  let announcementsList = [];
  let remake;
  let fileUrls = [];

  switch (type) {
    case ReceiptsEnums.instockOrder:
      details = ToolUtil.isArray(data.instockListResults);
      announcementsList = data.announcementsList || [];
      remake = data.remark;
      fileUrls = ToolUtil.isArray(data.url);
      break;
    case ReceiptsEnums.outstockOrder:
      details = ToolUtil.isArray(data.detailResults);
      announcementsList = data.announcementsResults || [];
      remake = data.note;
      fileUrls = ToolUtil.isArray(data.enclosureUrl);
      break;
    default:
      break;
  }

  const action = () => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return <SkuAction
          loading={loading}
          order={data}
          data={details}
          actionId={getAction('performInstock').id}
          action={getAction('performInstock').id && permissions}
          instockOrderId={data.instockOrderId}
          refresh={refresh}
        />;
      case ReceiptsEnums.outstockOrder:
        return <OutSkuAction
          taskId={taskId}
          loading={loading}
          data={details}
          actionId={getAction('outStock').id}
          action={getAction('outStock').id}
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

    <div hidden={type !== ReceiptsEnums.outstockOrder} className={style.dataItem}>
      <Title className={style.title}>领料负责人</Title>
      <div>{ToolUtil.isObject(data.userResult).name}</div>
    </div>

    <div className={style.space} />

    <div className={style.careful}>
      <Title>注意事项</Title>
      <div>
        {announcementsList.length === 0 && <div style={{padding:8}}>无</div>}
        {announcementsList.map((item, index) => {
          return <div key={index} className={style.carefulShow}>
            {item.content}
          </div>;
        })}
      </div>
    </div>

    <div className={style.note}>
      <Title>备注</Title>
      <div className={style.remake}>{remake || '无'}</div>
    </div>

    <div className={style.file}>
      <Title>附件</Title>
      <div className={style.files}>
        {fileUrls.length === 0 && '无'}
        <UploadFile show value={fileUrls.map(item => {
          return {
            url: item,
            type:'image'
          };
        })} />
      </div>
    </div>
  </>;
};

export default InstockOrder;
