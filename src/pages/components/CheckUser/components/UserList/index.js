import React, { useEffect, useRef, useState } from 'react';
import { IndexBar, List } from 'antd-mobile';
import { useRequest } from '../../../../../util/Request';
import { useModel } from 'umi';
import { isArray, ToolUtil } from '../../../ToolUtil';
import MyEmpty from '../../../MyEmpty';
import { MyLoading } from '../../../MyLoading';
import { pinyin } from 'pinyin-pro';
import MySearch from '../../../MySearch';
import { CheckOutline } from 'antd-mobile-icons';
import { UserName } from '../../../User';
import BottomButton from '../../../BottomButton';

export const userList = { url: '/formUser/userList', method: 'POST' };

const UserList = (
  {
    show,
    onShow = () => {
    },
    multiple,
    hiddenCurrentUser,
    value = [],
    onChange = () => {
    },
    onClose = () => {
    },
  }) => {

  const [users, setUsers] = useState(value);

  const { initialState } = useModel('@@initialState');
  const userInfo = ToolUtil.isObject(initialState).userInfo || {};

  const indexBarRef = useRef(null);

  const [data, setData] = useState([]);
  const [init, setInit] = useState([]);

  const [name, setName] = useState();

  const checked = (userId) => {
    return users.filter(item => item.id === userId).length > 0;
  };

  const { loading, run } = useRequest(userList, {
    manual: true,
    onSuccess: (res) => {
      const users = [];
      const checkUser = [];
      ToolUtil.isArray(res).forEach(item => {
        if (hiddenCurrentUser && item.userId === userInfo.id) {
          return;
        }
        if (checked(item.userId)) {
          checkUser.push({ name: item.name, id: item.userId });
        }
        users.push({
          name: item.name,
          id: item.userId,
          avatar: item.avatar,
          dept: item.deptResult?.fullName,
          role: isArray(item.roleResults)[0]?.name,
        });
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
      setInit(groups);

      if (checkUser[0] && !multiple) {
        const pys = pinyin(checkUser[0].name, { pattern: 'first', toneType: 'none', type: 'array' });
        const first = pys[0];
        indexBarRef.current.scrollTo(first.toUpperCase());
      }

    },
  });

  useEffect(() => {
    run({ data: {} });
  }, []);

  if (loading && data.length === 0) {
    return <MyLoading skeleton />;
  }

  return (
    <div style={{ height: `calc(100vh - ${ToolUtil.isQiyeWeixin() ? 75 : 120}px)` }}>
      <MySearch value={name} onChange={setName} onClear={() => setData(init)} onSearch={(name) => {
        const newData = [];
        init.forEach(item => {
          const users = item.items || [];
          const newUsers = users.filter(item => ToolUtil.queryString(name, item.name));
          if (newUsers.length > 0) {
            newData.push({ ...item, items: newUsers });
          }
        });
        setData(newData);
      }} />
      {data.length === 0 ? <MyEmpty description='暂无人员' /> :
        <IndexBar style={{ paddingBottom: show ? 0 : 60 }} ref={indexBarRef}>
          {data.map(group => {
            const { title, items } = group;
            return (
              <IndexBar.Panel
                index={title}
                title={title}
                key={title}
              >
                <List>
                  {items.map((item, index) => {
                    return <List.Item
                      arrow={checked(item.id) ?
                        <CheckOutline style={{ color: 'var(--adm-color-primary)' }} /> : false}
                      key={index}
                      onClick={() => {
                        if (show) {
                          onShow(item);
                          return;
                        }
                        if (checked(item.id)) {
                          setUsers(multiple ? users.filter(user => user.id !== item.id) : []);
                        } else {
                          setUsers(multiple ? [...users, item] : [item]);
                        }
                      }}
                    >
                      <UserName user={item} size={40} />
                    </List.Item>;
                  })}
                </List>
              </IndexBar.Panel>
            );
          })}
        </IndexBar>}

      {!show && <BottomButton leftOnClick={onClose} rightOnClick={() => {
        onChange(users);
      }} />}
    </div>
  );
};

export default UserList;
