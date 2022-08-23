import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuAction from './components/SkuAction';
import { ReceiptsEnums } from '../../../../../index';
import OutSkuAction from '../OutStockOrder/components/OutSkuAction';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import MyCard from '../../../../../../components/MyCard';
import { UserName } from '../../../../../../components/User';

const InstockOrder = (
  {
    loading,
    data = {},
    refresh = () => {
    },
    permissions,
    getAction = () => {
      return {};
    },
    afertShow = () => {
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
          afertShow={afertShow}
          loading={loading}
          order={data}
          taskId={taskId}
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
    {action()}

    <MyCard
      hidden={type !== ReceiptsEnums.outstockOrder}
      title='领料负责人'
      extra={<UserName user={data.userResult} />}
    />

    <MyCard title='注意事项'>
        {announcementsList.length === 0 && <div>无</div>}
        {announcementsList.map((item, index) => {
          return <div key={index} className={style.carefulShow} style={{margin:index === 0 && 0}}>
            {item.content}
          </div>;
        })}
    </MyCard>

    <MyCard title='备注'>
      <div className={style.remake}>{remake || '无'}</div>
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {fileUrls.length === 0 && '无'}
        <UploadFile show files={fileUrls.map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>
  </>;
};

export default InstockOrder;
