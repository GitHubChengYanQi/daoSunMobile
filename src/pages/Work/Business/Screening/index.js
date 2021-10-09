import React, { useState } from 'react';
import { Button, Flex, FlexItem, List, ListItem } from 'weui-react-v2';
import { Card } from 'antd';
import { router } from 'umi';
import { Radio, Selector, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { crmBusinessSalesList, OrgNameListSelect } from '../BusinessUrl';

const Screening = ({ select }) => {

  const [screning, setScreening] = useState({});

  const { data:origin } = useRequest(OrgNameListSelect);

  const { data:sales } = useRequest(crmBusinessSalesList);


  const salesArray = sales ? sales.map((values) => {
    return {
      label: values.name,
      value: values.salesId,
    };
  }) : [];


  return (
    <>
      <List>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>完单状态</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={2}
              options={[{
                label: '赢单',
                value: '赢单',
              }, {
                label: '输单',
                value: '输单',
              }]}
              onChange={arr => setScreening({ ...screning, state: arr[0] })}
            />
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>项目流程</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={2}
              options={salesArray}
              onChange={arr => setScreening({ ...screning, salesId: arr[0] })}
            />
          </Card>
        </ListItem>
        <ListItem>
          <Card headStyle={{ border: 'none' }} title={<div style={{ textAlign: 'center' }}>项目来源</div>}
                bodyStyle={{ padding: 0 }} bordered={false}>
            <Selector
              columns={3}
              options={origin || []}
              onChange={arr => setScreening({ ...screning, originId: arr[0] })}
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
