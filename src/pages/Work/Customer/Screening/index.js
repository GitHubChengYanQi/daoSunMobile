import React, { useState } from 'react';
import { Button, Flex, FlexItem, List, ListItem } from 'weui-react-v2';
import { Card } from 'antd';
import { router } from 'umi';
import { Radio, Selector, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';

const Screening = ({ select }) => {

  const [screning, setScreening] = useState({});

  const { data } = useRequest({ url: '/crmCustomerLevel/list', method: 'POST', rowKey: 'customerLevelId' });

  const crmCustomerLevel = data ? data.map((values) => {
    return {
      label: values.level,
      value: values.customerLevelId,
    };
  }) : [];


  return (
    <>
      <List>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户状态</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={2}
              options={[{
                label: '潜在客户',
                value: '0',
              }, {
                label: '正式客户',
                value: '1',
              }]}
              onChange={arr => setScreening({ ...screning, status: arr[0] })}
            />
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户分类</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={2}
              options={[{
                label: '代理商',
                value: '0',
              }, {
                label: '终端用户',
                value: '1',
              }]}
              onChange={arr => setScreening({ ...screning, classification: arr[0] })}
            />
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>客户级别</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={3}
              options={crmCustomerLevel}
              onChange={arr => setScreening({ ...screning, customerLevelId: arr[0] })}
            />
          </Card>
        </ListItem>
        <ListItem style={{ textAlign: 'center' }}>
          <Button type='primary' style={{ marginRight: 16 }} onClick={() => {
            typeof select === 'function' && select(screning);
          }}>确定</Button> <Button type='primary' onClick={() => {
          typeof select === 'function' && select(null);
        }}>取消</Button>
        </ListItem>
      </List>

    </>
  );
};

export default Screening;
