import React from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { isArray, isObject, ToolUtil } from '../../../../../../components/ToolUtil';
import SkuAction from './components/SkuAction';
import { ReceiptsEnums } from '../../../../../index';
import OutSkuAction from '../OutStockOrder/components/OutSkuAction';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import MyCard from '../../../../../../components/MyCard';
import { UserName } from '../../../../../../components/User';
import LinkButton from '../../../../../../components/LinkButton';
import { useHistory } from 'react-router-dom';

const InstockOrder = (
  {
    actionNode,
    taskDetail = {},
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
    logIds = [],
    taskId,
    actions = [],
  }) => {

  const history = useHistory();

  let details = [];
  let announcementsList = [];
  let remake;
  let fileUrls = [];
  let handleResults = [];
  const origin = isArray(isObject(taskDetail.themeAndOrigin).parent)[0]?.ret;

  switch (type) {
    case ReceiptsEnums.instockOrder:
      details = ToolUtil.isArray(data.instockListResults);
      handleResults = ToolUtil.isArray(data.handleResults);
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
          actionNode={actionNode}
          logIds={logIds}
          taskId={taskId}
          loading={loading}
          handleResults={handleResults}
          order={data}
          nodeActions={actions}
          data={details}
          permissions={permissions}
          actionId={getAction('performInstock').id}
          action={getAction('performInstock').id && permissions}
          instockOrderId={data.instockOrderId}
          refresh={refresh}
          afertShow={afertShow}
          taskDetail={taskDetail}
        />;
      case ReceiptsEnums.outstockOrder:
        return <OutSkuAction
          actionNode={actionNode}
          logIds={logIds}
          afertShow={afertShow}
          nodeActions={actions.map(item => ({ ...item, name: item.action === 'outStock' ? '领料' : item.name }))}
          taskDetail={taskDetail}
          loading={loading}
          order={data}
          taskId={taskId}
          data={details}
          permissions={permissions}
          actionId={getAction('outStock').id}
          action={getAction('outStock').id && permissions}
          pickListsId={data.pickListsId}
          refresh={refresh}
        />;
      default:
        return <></>;
    }
  };

  const getOutType = (type) => {
    switch (type) {
      case 'task':
        return '生产任务';
      case 'loss':
        return '生产损耗';
      case 'service':
        return '三包服务';
      case 'pick':
        return '备品备料';
      default:
        return '-';
    }
  };

  return <>
    {action()}

    <MyCard title='来源' hidden={!origin}>
      <LinkButton onClick={() => history.push(`/Receipts/ReceiptsDetail?id=${origin.fromId}`)}>
        {origin?.title} / {origin?.coding}
      </LinkButton>
    </MyCard>

    <MyCard
      hidden={type !== ReceiptsEnums.instockOrder}
      title='供应商'
      extra={data.customerResult?.customerName || '无'}
    />

    <MyCard
      title='主题'
      extra={taskDetail.theme || '无'}
    />

    <MyCard
      hidden={type !== ReceiptsEnums.outstockOrder}
      title='领料负责人'
      extra={<UserName user={data.userResult} />}
    />

    <MyCard
      hidden={type !== ReceiptsEnums.outstockOrder}
      title='出库类型'
      extra={getOutType(data.type)}
    />

    <MyCard title='注意事项'>
      {announcementsList.length === 0 && <div>无</div>}
      {announcementsList.map(item => item.content).join('、')}
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
