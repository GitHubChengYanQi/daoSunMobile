import React, { useRef, useState } from 'react';
import { ToolUtil } from '../ToolUtil';
import wx from 'populee-weixin-js-sdk';
import SelectUsers from '../SelectUsers';
import { useRequest } from '../../../util/Request';
import { Toast } from 'antd-mobile';
import CheckUser from '../CheckUser';

const getUserByCpUserId = { url: '/ucMember/getUserByCp', method: 'GET' };

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

  const [loading, setLoading] = useState();


  const valueChange = (string, array = []) => {
    onChange(string, array);
    setUsers(array);
  };

  const { run: getUser } = useRequest(getUserByCpUserId, {
    manual: true,
    onSuccess: (res) => {
      setLoading(false);
      if (res && res.userId) {
        valueChange(value + res.name, [...users, { userId: res.userId, name: res.name }]);
      } else {
        Toast.show({ content: '系统无此用户，请先注册！', position: 'bottom' });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });


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
