import React from 'react';
import { Button, Space } from 'antd-mobile';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MyCheckUser from '../../../../../components/MyCheckUser';
import { getHeader } from '../../../../../components/GetHeader';
import wx from 'populee-weixin-js-sdk';

const SelectUser = ({ value, onChange }) => {

  const showUser = (name) => {
    return <Space align='center'>
      <Avatar size={32}> <span style={{ fontSize: 24 }}>{name.substring(0, 1)}</span></Avatar>{name}
    </Space>;
  };

  const showDefault = () => {
    return <Space align='center'>
      <Avatar size={32}> <span style={{ fontSize: 24 }}><UserOutlined /></span></Avatar>待认领
    </Space>;
  };

  const wxUsers = () => {
    wx.ready(() => {
      wx.invoke("selectEnterpriseContact", {
          "fromDepartmentId": 0,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
          "mode": "multi",// 必填，选择模式，single表示单选，multi表示多选
          "type": ["department", "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
          "selectedDepartmentIds": ["2","3"],// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
          "selectedUserIds": ["lisi","lisi2"]// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
        },function(res){
          if (res.err_msg === "selectEnterpriseContact:ok")
          {
            if(typeof res.result == 'string')
            {
              res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }

            var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
            for (var i = 0; i < selectedDepartmentList.length; i++)
            {
              var department = selectedDepartmentList[i];
              var departmentId = department.id;// 已选的单个部门ID
              var departemntName = department.name;// 已选的单个部门名称
            }
            var selectedUserList = res.result.userList; // 已选的成员列表
            for (var i = 0; i < selectedUserList.length; i++)
            {
              var user = selectedUserList[i];
              var userId = user.id; // 已选的单个成员ID
              var userName = user.name;// 已选的单个成员名称
              var userAvatar= user.avatar;// 已选的单个成员头像
            }
          }
        }
      );
    })

  }

  return <>
    {!getHeader() ?
      <Button onClick={() => {
        wxUsers();
      }}>选人</Button>
      :
      <MyCheckUser value={value} onChange={onChange}>
        {value ? showUser(value.name) : showDefault()}
      </MyCheckUser>}
  </>;
};

export default SelectUser;
