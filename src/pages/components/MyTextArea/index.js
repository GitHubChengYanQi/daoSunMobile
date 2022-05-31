import React, { useRef, useState } from 'react';
import { ToolUtil } from '../ToolUtil';
import wx from 'populee-weixin-js-sdk';
import SelectUsers from '../SelectUsers';
import { useRequest } from '../../../util/Request';
import { Toast } from 'antd-mobile';
import { MyLoading } from '../MyLoading';

const getUserByCpUserId = { url: '/ucMember/getUserByCp', method: 'GET' };

const MyTextArea = (
  {
    className,
    onChange = () => {

    },
    value: defaultValue,
    userIds = () => {
    },
  },
) => {

  const ref = useRef();

  const userRef = useRef();

  const [height, setHeight] = useState();

  const [value, setValue] = useState(defaultValue);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState();


  const valueChange = (string, array) => {
    onChange(string, array);
    setValue(string);
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
  });

  const invoke = () => {
    wx.ready(() => {
      wx.invoke('selectEnterpriseContact', {
          'fromDepartmentId': 0,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
          'mode': 'single',// 必填，选择模式，single表示单选，multi表示多选
          'type': ['user'],// 必填，选择限制类型，指定department、user中的一个或者多个
        }, (res) => {
          if (res.err_msg === 'selectEnterpriseContact:ok') {
            setLoading(true);
            if (typeof res.result == 'string') {
              res.result = JSON.parse(res.result); //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }

            const deptList = res.result.departmentList;// 已选的部门列表
            const depts = deptList.map((item) => {
              return {
                departmentId: item.id,// 已选的单个部门ID
                departemntName: item.name,// 已选的单个部门名称
              };
            });

            const userList = res.result.userList; // 已选的成员列表
            const userIds = userList.map((item) => {
              return item.id;
            });

            if (users.length > 0) {
              getUser({ params: { CpUserId: userIds[0] } });
            }
          }
        },
      );
    });


  };

  return <>
    <div className={ToolUtil.classNames('adm-text-area', className)}>
      <textarea
        value={value}
        ref={ref}
        id='text'
        placeholder='可@相关人员'
        className='adm-text-area-element'
        rows={1}
        style={{ maxHeight: height }}
        onKeyUp={(even) => {
          ToolUtil.listenOnKeyUp({
            even, value, callBack: () => {
              if (ToolUtil.isQiyeWeixin()) {
                invoke();
              } else {
                userRef.current.setVisible(true);
              }
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

    {loading && <MyLoading />}

    <SelectUsers
      ref={userRef}
      onChange={(user) => {
        if (user && user.length > 0) {
          valueChange(value + user[0].name, [...users, user[0]]);
        }
      }} />
  </>;
};

export default MyTextArea;
