import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import Careful from '../Careful';
import MyTextArea from '../../../../../../../../components/MyTextArea';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import MyCard from '../../../../../../../../components/MyCard';

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
    <MyCard
      titleBom={careful}>
      <Careful
        type={createType}
        value={params.noticeIds}
        onChange={(noticeIds) => {
          setParams({ ...params, noticeIds });
        }}
      />
    </MyCard>

    <MyCard title='添加备注'>
      <MyTextArea
        value={params.remark}
        textClassName={style.textArea}
        onChange={(remark, userIds) => {
          setParams({ ...params, remark, userIds: userIds.map(item => item.userId) });
        }}
      />
    </MyCard>

    <MyCard title='上传附件'>
      <div className={style.files}>
        <UploadFile
          onChange={(mediaIds) => {
            setParams({ ...params, mediaIds });
          }}
        />
      </div>
    </MyCard>
  </>;
};


export default OtherData;
