import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import wx from 'populee-weixin-js-sdk';
import { Message } from '../Message';
import { isArray, ToolUtil } from '../../../util/ToolUtil';
import { MyLoading } from '../MyLoading';
import IsDev from '../../../components/IsDev';
import MyAntPopup from '../MyAntPopup';
import UserList from './components/UserList';
import style from './index.less';

const getUserByCpUserId = { url: '/ucMember/getUserByCps', method: 'POST' };

const CheckUser = (
  {
    zIndex,
    value = [],
    multiple,
    onChange = () => {
    },
    onClose = () => {
    },
    afterShow = () => {
    },
    hiddenCurrentUser,
    getContainer,
  },
  ref,
) => {

  const [visible, setVisible] = useState();

  const [params, setParams] = useState({});

  const { loading: getUserLoading, run: getUser } = useRequest(getUserByCpUserId, {
    manual: true,
    onSuccess: (res) => {
      console.log('users', res);
      const users = res || [];
      if (users.length > 0) {
        onChange(users.map(item => ({
          id: item.userId,
          name: item.name,
          avatar: item.avatar,
          dept: item.deptResult?.fullName,
          role: isArray(item.roleResults)[0]?.name,
        })), params);
      } else {
        Message.errorToast('系统无此用户，请先注册！');
      }
    },
    onError: () => {
      Message.errorToast('获取用户失败！');
    },
  });

  const invoke = () => {
    wx.ready(() => {
      wx.invoke('selectEnterpriseContact', {
          'fromDepartmentId': 0,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
          'mode': multiple ? 'multi' : 'single',// 必填，选择模式，single表示单选，multi表示多选
          'type': ['user'],// 必填，选择限制类型，指定department、user中的一个或者多个
        }, (res) => {
          if (res.err_msg === 'selectEnterpriseContact:ok') {
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

            if (userIds.length > 0) {
              console.log('cpUserIds', userIds);
              getUser({ data: { cpUserIds: userIds } });
            }
          }
        },
      );
    });
  };

  const open = (param) => {
    setParams(param);
    if (ToolUtil.isQiyeWeixin() && !IsDev()) {
      invoke();
    } else {
      setVisible(true);
    }
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  return <>
    {getUserLoading && <MyLoading />}
    <MyAntPopup
      getContainer={getContainer}
      zIndex={zIndex}
      afterShow={afterShow}
      title='选择人员'
      className={style.popup}
      visible={visible}
      onClose={() => {
        onClose();
        setVisible(false);
      }}>
      <UserList
        multiple={multiple}
        value={value}
        onClose={() => setVisible(false)}
        hiddenCurrentUser={hiddenCurrentUser}
        onChange={(items) => {
          onChange(items, params);
          setVisible(false);
        }} />
    </MyAntPopup>
  </>;
};

export default React.forwardRef(CheckUser);
