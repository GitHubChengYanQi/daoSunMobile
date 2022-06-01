import React from 'react';
import { List, Space } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';

const Type = (
  {
    value,
    onSuccess = () => {
    },
  }) => {

  return <>
    <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
      <List.Item
        extra={<Space>
          {value === '采购入库' && <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />}
          {/*<LinkButton>编辑</LinkButton>*/}
        </Space>}
      >
        <div onClick={() => {
          onSuccess('采购入库');
        }}>
          采购入库
        </div>
      </List.Item>
      <List.Item
        arrow={false}
        extra={<Space>
          {value === '生产入库' && <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />}
          {/*<LinkButton>编辑</LinkButton>*/}
        </Space>}
      >
        <div onClick={() => {
          onSuccess('生产入库');
        }}>
          生产入库
        </div>
      </List.Item>
    </List>
  </>;
};

export default Type;
