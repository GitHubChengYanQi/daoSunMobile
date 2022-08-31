import React from 'react';
import UserList from '../../components/CheckUser/components/UserList';
import MyNavBar from '../../components/MyNavBar';
import { useHistory } from 'react-router-dom';

const MailList = () => {

  const history = useHistory();

  return <>
    <MyNavBar title='通讯录' />
    <UserList hiddenCurrentUser show onShow={(user) => {
      history.push(`/Work/MailList/UserInfo?id=${user.id}`);
    }} />
  </>;
};

export default MailList;
