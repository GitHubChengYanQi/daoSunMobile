import React, { useRef, useState } from 'react';
import style from '../../index.less';
import UploadFile from '../../../../../components/Upload/UploadFile';
import MyTextArea from '../../../../../components/MyTextArea';
import { PaperClipOutlined } from '@ant-design/icons';
import LinkButton from '../../../../../components/LinkButton';
import { ToolUtil } from '../../../../../components/ToolUtil';

const Note = (
  {
    value = {},
    onInput = () => {
    },
    onChange = () => {
    },
    uploadId,
    noAdd,
    className,
    loading = () => {
    },
    autoFocus,
    textAreaId,
    placeholder,
  },
) => {


  const [mediaIds, setMediaId] = useState([]);

  const [medias, setMedias] = useState([]);

  const [userIds, setUserIds] = useState([]);

  const [note, setNote] = useState('');

  const addFileRef = useRef();

  return <>
    <div className={ToolUtil.classNames(style.content, className)}>
      <div className={style.imgs}>
        <UploadFile
          files={noAdd ? value.files : medias}
          loading={loading}
          uploadId={uploadId}
          noAddButton
          ref={addFileRef}
          onChange={(medias) => {
            if (noAdd) {
              onChange({ ...value, files: medias, mediaIds: medias.map(item => item.mediaId) });
            }
            setMedias(medias);
            setMediaId(medias.map(item => item.mediaId));
          }}
        />
      </div>
      <div className={style.comments}>
        <MyTextArea
          maxLength={50}
          className={style.textarea}
          value={note}
          id={textAreaId}
          placeholder={placeholder || '添加备注，可@相关人员...'}
          autoFocus={autoFocus}
          onFocus={() => onInput(true)}
          onChange={(note, users = []) => {
            const userIds = users.map(item => item.userId);
            if (noAdd) {
              onChange({ ...value, note, userIds });
            }
            setNote(note);
            setUserIds(userIds);
          }}
        />
        <PaperClipOutlined onClick={() => {
          addFileRef.current.addFile();
        }} />
        <div hidden={noAdd}>
          <LinkButton
            disabled={!note}
            className={style.add}
            onClick={() => {
              onChange({ userIds, mediaIds, note });
            }}
          >添加</LinkButton>
        </div>
      </div>
    </div>
  </>;
};

export default Note;
