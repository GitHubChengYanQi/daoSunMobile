import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { Card } from 'antd';
import { Selector } from 'antd-mobile';

import { Button, ListItem } from 'weui-react-v2';

const Screening = ({ select }) => {

  const [screning, setScreening] = useState({});

  const { data } = useRequest({
    url: '/dataClassification/listSelect',
    method: 'POST',
  });

  return (
    <div>

      <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center', padding: '10px' }}>所有分类</div>}
            bodyStyle={{ padding: 0 }} bordered={false}>
      </Card>
      <Selector
        style={{ padding: '10px' }}
        multiple={false}
        options={data || []}
        onChange={arr => setScreening({ ...screning, dataClassificationId: arr[0] })}
      />
      <ListItem style={{ textAlign: 'center' }}>
        <Button type='primary' style={{ marginRight: 16 }} onClick={() => {
          typeof select === 'function' && select(screning);
        }}>确定</Button>

        <Button type='primary' onClick={() => {
          typeof select === 'function' && select(null);
        }}>取消</Button>
      </ListItem>

    </div>
  );
};
export default Screening;
