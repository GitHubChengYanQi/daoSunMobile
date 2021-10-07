import React from 'react';
import { useRequest } from '../../../../util/Request';
import { List } from 'antd-mobile';
import { Avatar } from 'antd';
import { Skeleton } from 'weui-react-v2';

const {Item} = List;

const Dynamic = (props) => {

  const {customerId} = props;

  const {loading,data} = useRequest({url:'/customerDynamic/list',method:'POST',data:{customerId:customerId || ''}});

  if (loading){
    return <Skeleton loading={loading} />;
  }

  if (data && data.length > 0){
    return (
      <>
        <List>
          {data.map((data,index)=>{
            return (
              <Item key={index} extra={data.createTime} title={data.userResult ? data.userResult.name : '--'} wrap align='top'
                    prefix={<Avatar>{data.userResult && data.userResult.name && data.userResult.name.substring(0,1)}</Avatar>}>
                {data.content}
              </Item>
            );
          })}
        </List>
      </>
    );
  }else {
    return null;
  }

};

export default Dynamic;
