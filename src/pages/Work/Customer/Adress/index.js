import React from 'react';
import { ZoomInOutlined } from '@ant-design/icons';
import { List } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { Spin, WhiteSpace } from 'weui-react-v2';

const Adress = ({ customerId }) => {

  const { loading, data } = useRequest({ url: '/adress/list', method: 'POST', data: { customerId: customerId || '' } });

  if (loading) {
    return (
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Spin spinning={true} size='large' />
      </div>
    );
  }

  if (data && data.length > 0) {
    return (
      <List>
        {
          data.map((items, index) => {
            return (
              <List.Item key={index} extra={<ZoomInOutlined />} align='top'>
                省市区：{items.regionResult && `${items.regionResult.countries }-${ items.regionResult.province }-${ items.regionResult.city }-${ items.regionResult.area}`}
                <WhiteSpace size={'sm'} />
                详细地址：{items.location}
              </List.Item>
            );
          })
        }
      </List>
    );
  } else {
    return null;
  }

};

export default Adress;
