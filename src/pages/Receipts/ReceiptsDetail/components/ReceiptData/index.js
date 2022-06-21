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

  const receiptType = () => {
    switch (data.type) {
      case ReceiptsEnums.instockOrder:
      case ReceiptsEnums.outstockOrder:
        return <InstockOrder
          permissions={permissions}
          data={data.receipts}
          currentNode={currentNode}
          refresh={refresh}
          loading={loading}
          type={data.type}
        />;
      case ReceiptsEnums.instockError:
        return <InstockError
          permissions={permissions}
          data={data.receipts}
          currentNode={currentNode}
          refresh={refresh}
        />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    {receiptType()}
    <Process auditData={data.stepsResult} createName={data.createName} card />
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
