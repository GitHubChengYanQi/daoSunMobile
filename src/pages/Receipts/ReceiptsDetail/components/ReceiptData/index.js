import React from 'react';
import { ReceiptsEnums } from '../../../index';
import MyEmpty from '../../../../components/MyEmpty';
import InstockOrder from './components/InstockOrder';
import Process from '../../../../Work/PurchaseAsk/components/Process';
import Comments from '../../../components/Comments';
import MyTextArea from '../../../../components/MyTextArea';
import style from './index.less';
import UpLoadImg from '../../../../components/Upload';
import { PaperClipOutlined } from '@ant-design/icons';
import InstockError from './components/InstockError';
import { ToolUtil } from '../../../../components/ToolUtil';
import Stocktaking from './components/Stocktaking';
import Maintenance from './components/Maintenance';
import SkuError from './components/InstockError/components/SkuError';

const ReceiptData = (
  {
    params = {},
    setParams = () => {
    },
    data = {},
    currentNode,
    refresh = () => {
    },
    loading,
    permissions,
  }) => {

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

  const receiptType = () => {
    switch (data.type) {
      case ReceiptsEnums.instockOrder:
      case ReceiptsEnums.outstockOrder:
        return <InstockOrder
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refresh}
          loading={loading}
          type={data.type}
        />;
      case ReceiptsEnums.instockError:
        return <InstockError
          permissions={permissions}
          data={data.receipts}
          getAction={getAction}
          refresh={refresh}
        />;
      case ReceiptsEnums.stocktaking:
        return <Stocktaking
          permissions={permissions}
          receipts={data.receipts}
          getAction={getAction}
          refresh={refresh}
        />;
      case ReceiptsEnums.maintenance:
        return <Maintenance
          getAction={getAction}
          refresh={refresh}
          permissions={permissions}
          receipts={data.receipts}
        />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    {receiptType()}
    <Process auditData={data.stepsResult} createUser={data.user} card />
    <Comments detail={data} id={data.processTaskId} />
    <div hidden={currentNode.filter(item => item.stepType === 'audit').length === 0}>
      <MyTextArea
        placeholder='填写审批意见，可@相关人员'
        className={style.text}
        value={params.note}
        onChange={(note, users = []) => {
          setParams({ ...params, note, userIds: users.map(item => item.userId) });
        }}
      />
      <div className={style.img}>
        <UpLoadImg
          maxCount={1}
          showUploadList
          type='picture'
          id='file'
          onRemove={() => {
            setParams({ ...params, mediaIds: [] });
          }}
          onChange={(url, mediaId) => {
            setParams({ ...params, mediaIds: [mediaId] });
          }}
          button={ToolUtil.isArray(params.mediaIds).length === 1 ? <></> : <div className={style.upload}>
            <PaperClipOutlined />
          </div>}
        />
      </div>
    </div>


  </>;
};

export default ReceiptData;
