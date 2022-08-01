import React, { useEffect, useRef, useState } from 'react';
import { IndexBar, List } from 'antd-mobile';
import { useRequest } from '../../../../../util/Request';
import { UserIdSelect } from '../../../../Work/Customer/CustomerUrl';
import { useModel } from 'umi';
import { ToolUtil } from '../../../ToolUtil';
import MyEmpty from '../../../MyEmpty';
import { MyLoading } from '../../../MyLoading';
import { pinyin } from 'pinyin-pro';
import MySearch from '../../../MySearch';
import { CheckOutline } from 'antd-mobile-icons';

const UserList = (
  {
    hiddenCurrentUser,
    value,
    onChange = () => {
    },
  }) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

  const indexBarRef = useRef(null);

  const [data, setData] = useState([]);

  const { loading, run } = useRequest(UserIdSelect, {
    manual: true,
    onSuccess: (res) => {
      const users = [];
      let checkUser;
      ToolUtil.isArray(res).forEach(item => {
        if (hiddenCurrentUser && item.value === userInfo.id) {
          return;
        }
        if (value && value === item.value) {
          checkUser = { name: item.label, id: item.value };
        }
        users.push({ name: item.label, id: item.value });
      });
      const charCodeOfA = 'A'.charCodeAt(0);
      const groups = [];
      Array(26).fill('').forEach((_, i) => {
        const CharCode = String.fromCharCode(charCodeOfA + i);
        const newUsers = users.filter(item => {
          const pys = pinyin(item.name, { pattern: 'first', toneType: 'none', type: 'array' });
          const first = pys[0];
          return first.toUpperCase() === CharCode;
        });
        if (newUsers.length === 0) {
          return;
        }
        groups.push({
          title: CharCode,
          items: newUsers,
        });
      });
      setData(groups);

      if (checkUser) {
        const pys = pinyin(checkUser.name, { pattern: 'first', toneType: 'none', type: 'array' });
        const first = pys[0];
        indexBarRef.current.scrollTo(first.toUpperCase());
      }

    },
  });

  useEffect(() => {
    run();
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty description='暂无人员' />;
  }

  return (
    <div style={{ height: '80vh' }}>
      <MySearch onSearch={(name) => {
        run({ data: { name } });
      }} />
      <IndexBar ref={indexBarRef}>
        {data.map(group => {
          const { title, items } = group;
          return (
            <IndexBar.Panel
              index={title}
              title={title}
              key={title}
            >
              <List>
                {items.map((item, index) => (
                  <List.Item arrow={value === item.id ? <CheckOutline style={{color:'var(--adm-color-primary)'}} /> : false} key={index} onClick={() => {
                    onChange(item);
                  }}>{item.name}</List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          );
        })}
      </IndexBar>
    </div>
  );
};

export default UserList;