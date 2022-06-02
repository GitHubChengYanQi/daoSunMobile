import React, { useRef, useState } from 'react';
import SelectUsers from '../SelectUsers';
import style from './index.less';
import { PaperClipOutlined } from '@ant-design/icons';
import UpLoadImg from '../Upload';
import MyTextArea from '../MyTextArea';

const MentionsNote = (
  {
    getUserIds = () => {
    },
    onChange = () => {
    },
    value,
    placeholder,
    imgs = [],
    getImgs = () => {
    },
  }) => {

  const [users, setUsers] = useState([]);


  const ref = useRef();

  return <>
    <MyTextArea
      value={value}
      row={3}
      className={style.text}
      placeholder='添加评论，可@相关人员...'
      onChange={(string, users) => {
        getUserIds(users);
        onChange(string);
      }}
    />

    <div className={style.uploadImg}>
      <UpLoadImg
        maxCount={5}
        showUploadList
        type='picture'
        id='file'
        onChange={(url, mediaId, file) => {
          getImgs([...imgs, {
            mediaId,
            fileId: file.uid,
          }]);
        }}
        onRemove={(file) => {
          getImgs(imgs.filter(item => item.fileId !== file.uid));
        }}
        button={<div className={style.button}>
          <div>上传</div>
          <PaperClipOutlined />
        </div>}
      />
    </div>
    <SelectUsers
      ref={ref}
      onChange={(user) => {
        if (user && user.length > 0) {
          typeof onChange === 'function' && onChange(value + user[0].label);
          const array = users;
          array.push(user[0]);
          setUsers(array);
          typeof getUserIds === 'function' && getUserIds(array);
        }
      }} />
  </>;

};

export default MentionsNote;
