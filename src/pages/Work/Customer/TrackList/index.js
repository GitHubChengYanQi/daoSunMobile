import React  from 'react';
import { useRequest } from '../../../../util/Request';
import { Skeleton, WhiteSpace } from 'weui-react-v2';
import { Image, List } from 'antd-mobile';
import { Avatar } from 'antd';

const TrackList = ({ customerId,classifyId,classify }) => {

  const { loading } = useRequest({ url: '/trackMessage/list', method: 'POST', data: { customerId: customerId } }, {
    onSuccess: async (res) => {
      if (customerId) {
        await run(
          {
            data: {
              customerId: customerId,
              classifyId:classifyId,
              classify:classify
            },
          },
        );
      }
    },
  });

  const { loading: LoadingTrack, data, run } = useRequest({
    url: '/trackMessage/list',
    method: 'POST',
  }, { manual: true });


  if (LoadingTrack || loading) {
    return <Skeleton loading />;
  }


  if (data && data.length > 0) {
    return (
      <List style={{maxHeight:500,overflow:'auto'}}>
        {data.map((items, index) => {
          return (
            <List.Item
              key={index}
              extra={items.createTime}
              title={items && items.userResult ? items.userResult.name : '--'} wrap align='top'
              prefix={
                <Avatar>{items.userResult && items.userResult.name && items.userResult.name.substring(0, 1)}</Avatar>}>
              跟进类型:{items.type}
              <WhiteSpace size={'sm'} />
               {items.image && <>图片: <Image src={items.image} width={100} /></>}
              <WhiteSpace size={'sm'} />
              跟进内容:{items.note}
            </List.Item>
          );
        })}
      </List>
    );
  } else {
    return null;
  }
};

export default TrackList;
