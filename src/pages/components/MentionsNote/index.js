import React, { useRef, useState } from 'react';
import { getLastMeasureIndex } from './LastMention';
import SelectUsers from '../SelectUsers';
import { Input } from 'antd';
import ImgUpload from '../Upload/ImgUpload';
import { Collapse } from 'antd-mobile';
import { PaperClipOutlined } from '@ant-design/icons';

const MentionsNote = ({ getUserIds, onChange, value, placeholder, getImgs }) => {

  const [users, setUsers] = useState([]);

  const [imgs, setImgs] = useState([]);

  const ref = useRef();

  const onKeyUp = (even) => {
    const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
      value,
      '@',
    );
    if (measureIndex !== -1) {
      if (even.key === measurePrefix || even.key === 'Shift') {
        ref.current.setVisible(true);
      }

    }
  };

  return <>
    <Input.TextArea
      rows={3}
      value={value}
      placeholder={placeholder}
      onChange={(value) => {
        const user = users.filter((items) => {
          return value.target.value.indexOf(items.label) !== -1;
        });
        setUsers(user);
        typeof getUserIds === 'function' && getUserIds(user);
        typeof onChange === 'function' && onChange(value.target.value);
      }}
      onKeyUp={(e) => {
        onKeyUp(e);
      }}
    />

    <Collapse>
      <Collapse.Panel key='1' title={<>上传  <PaperClipOutlined /></>}>
        <ImgUpload
          length={5}
          value={imgs}
          onChange={(value) => {
            typeof getImgs === 'function' && getImgs(value);
            setImgs(value);
          }} />
      </Collapse.Panel>
    </Collapse>

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
