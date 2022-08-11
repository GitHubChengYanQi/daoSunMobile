import React from 'react';
import User from '../../../User';
import { useLocation } from 'umi';

const UserInfo = () => {

  const { query } = useLocation();

  return <>
    <User userId={query.id} />
  </>;
};

export default UserInfo;
