import React, { useRef, useState } from 'react';
import { ToolUtil } from '../ToolUtil';
import CheckUser from '../CheckUser';

const MyTextArea = (
  {
    className,
    placeholder,
    onChange = () => {

    },
    row = 1,
    value,
  },
) => {

  const ref = useRef();

  const userRef = useRef();

  const [height, setHeight] = useState();


  const [users, setUsers] = useState([]);

  const valueChange = (string, array = []) => {
    onChange(string, array);
    setUsers(array);
  };


  return <>
    <div className={ToolUtil.classNames('adm-text-area', className)}>
      <textarea
        value={value}
        ref={ref}
        id='text'
        placeholder={placeholder || '可@相关人员'}
        className='adm-text-area-element'
        rows={row}
        style={{ height }}
        onKeyUp={(even) => {
          ToolUtil.listenOnKeyUp({
            even, value: ref.current.value, callBack: () => {
              userRef.current.open();
            },
          });
        }}
        onChange={() => {
          const user = users.filter((items) => {
            return ref.current.value.indexOf(items.name) !== -1;
          });
          valueChange(ref.current.value, user);
          if (ref.current.scrollHeight <= 150) {
            setHeight(ref.current.scrollHeight);
          }
        }}
      >
        {value}
      </textarea>
    </div>

    <CheckUser ref={userRef} onChange={(id, name) => {
      valueChange(value + name, [...users, { userId: id, name: name }]);
    }} />
  </>;
};

export default MyTextArea;
