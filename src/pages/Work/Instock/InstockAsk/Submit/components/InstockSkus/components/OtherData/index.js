import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import Careful from '../Careful';
import MyTextArea from '../../../../../../../../components/MyTextArea';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import Title from '../../../../../../../../components/Title';

const OtherData = (
  {
    careful,
    createType,
    params = {},
    setParams = () => {
    },
  },
) => {


  return <>
    <div className={style.careful}>
      <Title className={style.title}>{careful} <span>*</span></Title>
      <Careful
        type={createType}
        value={params.noticeIds}
        onChange={(noticeIds) => {
          setParams({ ...params, noticeIds });
        }}
      />
    </div>

    <div className={style.note}>
      <Title className={style.title}>添加备注</Title>
      <MyTextArea
        value={params.remark}
        className={style.textArea}
        onChange={(remark, userIds) => {
          setParams({ ...params, remark, userIds: userIds.map(item => item.userId) });
        }}
      />
    </div>

    <div className={style.file}>
      <Title className={style.title}>上传附件</Title>
      <div className={style.files}>
        <UploadFile
          onChange={(mediaIds) => {
            setParams({ ...params, mediaIds });
          }}
        />
      </div>
    </div>
  </>;
};


export default OtherData;
