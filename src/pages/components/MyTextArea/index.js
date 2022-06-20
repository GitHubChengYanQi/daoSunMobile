import React, { useRef, useState } from 'react';
import { ToolUtil } from '../ToolUtil';
import CheckUser from '../CheckUser';
import { Input } from 'antd';
import style from './index.less';

const MyTextArea = (
  {
    className,
    placeholder,
    onChange = () => {

    },
    value,
  },
) => {


  const userRef = useRef();

  const [users, setUsers] = useState([]);

  const valueChange = (string, array = []) => {
    onChange(string, array);
    setUsers(array);
  };


  return <>
    <Input.TextArea
      autoSize
      value={value}
      className={ToolUtil.classNames(style.text,className)}
      placeholder={placeholder || '可@相关人员'}
      onKeyUp={(even) => {
        ToolUtil.listenOnKeyUp({
          even, value: value, callBack: () => {
            userRef.current.open();
          },
        });
      }}
      onChange={(textArea) => {
        const value = textArea.target.value;
        const user = users.filter((items) => {
          return value.indexOf(items.name) !== -1;
        });
        valueChange(value, user);
      }}
    />

    <CheckUser ref={userRef} onChange={(id, name) => {
      valueChange(value + name, [...users, { userId: id, name: name }]);
    }} />
  </>;
};

export default MyTextArea;
