import React from 'react';
import { useRequest } from '../../../../../../util/Request';
import MyEmpty from '../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../components/MyLoading';

const ListByInstockOrder = ({ id }) => {

  const { loading, data } = useRequest({
    url: '/instockLog/getListByInstockOrder',
    method: 'GET',
    params: { id },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  console.log(data);

  return <></>;
};

export default ListByInstockOrder;
