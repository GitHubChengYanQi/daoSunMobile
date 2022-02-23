import React, { useState } from 'react';
import { Button, Space } from 'antd-mobile';
import MyPicker from '../../../../components/MyPicker';
import { UserIdSelect } from '../../../Quality/Url';
import MySelector from '../../../../components/MySelector';

const Screening = (
  {
    onClose = () => {
    },
    onSuccess = () => {
    },
  }) => {

  const [select, setSelect] = useState({});

  return <>
    <Space direction='vertical'>
      <div>
        申请人:
        <div style={{ float: 'right' }}>
          <MyPicker
            value={select.createUser}
            api={UserIdSelect}
            onChange={(value) => {
              setSelect({
                ...select,
                createUser: value,
              });
            }} />
        </div>
      </div>
      状态:
      <MySelector
        value={select.status}
        columns={3}
        onChange={(value) => {
          setSelect({
            ...select,
            status: value,
          });
        }}
        options={[
          {
            value: -1,
            label: '未审批',
          },
          {
            value: 0,
            label: '审批中',
          },
          {
            value: 2,
            label: '已通过',
          },
          {
            value: 1,
            label: '已拒绝',
          },
          {
            value: 4,
            label: '采购中',
          },
          {
            value: 5,
            label: '已完成',
          },
        ]} />
      类型:
      <MySelector
        value={select.type}
        columns={3}
        onChange={(value) => {
          setSelect({
            ...select,
            type: value,
          });
        }}
        options={[
          {
            value: 0,
            label: '生产采购',
          },
          {
            value: 1,
            label: '库存采购',
          },
          {
            value: 2,
            label: '行政采购',
          },
          {
            value: 3,
            label: '销售采购',
          },
          {
            value: 4,
            label: '紧急采购',
          },
        ]} />
      申请时间：
      <MySelector
        columns={3}
        value={select.date}
        onChange={(value) => {
          setSelect({
            ...select,
            date: value,
          });
        }}
        options={[
          {
            value: 0,
            label: '3天内',
          },
          {
            value: 1,
            label: '7天内',
          },
          {
            value: 2,
            label: '15天内',
          },
          {
            value: 3,
            label: '30天内',
          },
        ]} />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Space>
          <Button color='primary' onClick={() => {
            onSuccess(select);
          }}>确定</Button>
          <Button onClick={() => {
            onClose();
          }}>取消</Button>
        </Space>
      </div>
    </Space>
  </>;
};

export default Screening;
