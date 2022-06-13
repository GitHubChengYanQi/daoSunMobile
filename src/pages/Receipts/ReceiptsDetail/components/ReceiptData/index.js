import React, { useState } from 'react';
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

const ReceiptData = (
  {
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
        return <InstockOrder permissions={permissions} data={data.receipts} currentNode={currentNode} refresh={refresh} loading={loading} />;
      case ReceiptsEnums.instockError:
        return <InstockError permissions={permissions} data={data.receipts} currentNode={currentNode} refresh={refresh} />;
      default:
        return <MyEmpty />;
    }
  };

  const [file, setFile] = useState();

  return <>
    {receiptType()}
    <Process auditData={data.stepsResult} createName={data.createName} card />
    <Comments detail={data} id={data.processTaskId} />
    {/*<MyTextArea placeholder='填写审批意见，可@相关人员' className={style.text} />*/}
    {/*<div className={style.img}>*/}
    {/*  <UpLoadImg*/}
    {/*    maxCount={1}*/}
    {/*    showUploadList*/}
    {/*    type='picture'*/}
    {/*    id='file'*/}
    {/*    onChange={(url, mediaId, file) => {*/}
    {/*      setFile(mediaId);*/}
    {/*    }}*/}
    {/*    button={file ? <></> : <div className={style.upload}>*/}
    {/*      <PaperClipOutlined />*/}
    {/*    </div>}*/}
    {/*  />*/}
    {/*</div>*/}

  </>;
};

export default ReceiptData;
