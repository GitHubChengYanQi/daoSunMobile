import React, { useImperativeHandle, useState } from 'react';
import { useRequest } from '../../../util/Request';
import { Picker } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import { Message } from '../Message';
import { ToolUtil } from '../ToolUtil';
import { UserIdSelect } from '../../Work/Customer/CustomerUrl';
import { MyLoading } from '../MyLoading';
import IsDev from '../../../components/IsDev';

const getUserByCpUserId = { url: '/ucMember/getUserByCp', method: 'GET' };

const CheckUser = (
  {
    value,
    onChange = (id, name, params) => {
    },
  },
  ref,
) => {

  const [visible, setVisible] = useState();

  const [params, setParams] = useState({});

  const { loading, data, run } = useRequest(UserIdSelect, {
    manual: true,
    onSuccess: () => {
      setVisible(true);
    },
  });

  const { loading: getUserLoading, run: getUser } = useRequest(getUserByCpUserId, {
    manual: true,
    onSuccess: (res) => {
      if (res && res.userId) {
        onChange(res.userId, res.name, params);
      } else {
        Message.toast('系统无此用户，请先注册！');
      }
    },
    onError: () => {
      Message.toast('获取用户失败！');
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
              getUser({ params: { CpUserId: userIds[0] } });
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
      run();
    }
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  if (loading) {
    return <MyLoading />;
  }

  return <>
    {getUserLoading && <MyLoading />}
    <Picker
      value={[value]}
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1002)' }}
      columns={[data || []]}
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      onConfirm={(value, options) => {
        const user = ToolUtil.isObject(options.items)[0] || {};
        onChange(user.value, user.label, params);
      }}
    />
  </>;
};

export default React.forwardRef(CheckUser);
