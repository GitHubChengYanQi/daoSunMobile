import React from 'react';
import { List, Space } from 'antd-mobile';
import LinkButton from '../../../../components/LinkButton';
import { CheckOutline } from 'antd-mobile-icons';

const Type = (
  {
    value,
    onSuccess = () => {
    },
  }) => {


  return <>
    <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
      <List.Item style={{ textAlign: 'center' }}>
        <LinkButton>新增入库类型</LinkButton>
      </List.Item>
      <List.Item
        arrow={false}
        extra={<Space align='center'>
          {value === '直接入库' && <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />}
          <LinkButton>编辑</LinkButton>
        </Space>}
      >
        <div onClick={() => {
          onSuccess('直接入库');
        }}>
          直接入库
        </div>
      </List.Item>
      <List.Item
        extra={<Space>
          {value === '采购入库' && <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />}
          <LinkButton>编辑</LinkButton>
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
          {value === '质检入库' && <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />}
          <LinkButton>编辑</LinkButton>
        </Space>}
      >
        <div onClick={() => {
          onSuccess('质检入库');
        }}>
          质检入库
        </div>
      </List.Item>
    </List>
  </>;
};

export default Type;
