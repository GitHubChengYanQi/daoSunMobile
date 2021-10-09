import React from 'react';
import { useRequest } from '../../../../util/Request';
import { List } from 'antd-mobile';
import { Avatar } from 'antd';
import { Skeleton } from 'weui-react-v2';

const {Item} = List;

const Dynamic = ({api}) => {

  const {loading,data} = useRequest(api);

  if (loading){
    return <Skeleton loading={loading} />;
  }

  if (data && data.length > 0){
    return (
      <>
        <List style={{maxHeight:500,overflow:'auto'}}>
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
