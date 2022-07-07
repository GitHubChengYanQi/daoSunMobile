import React from 'react';
import { Message } from '../components/Message';
import { Button, Space } from 'antd-mobile';

const Test = () => {

  return <>
    <Space direction='vertical'>
      <Space>
        <Button onClick={() => {
          Message.successDialog({});
        }}>成功1</Button>
        <Button onClick={() => {
          Message.successDialog({ only: true });
        }}>成功2</Button>
      </Space>

      <Space>
        <Button onClick={() => {
          Message.warningDialog({
            content: '有问题了！',
            only: false,
          });
        }}>警告1</Button>
        <Button onClick={() => {
          Message.warningDialog({
            content: '有问题了！',
          });
        }}>警告2</Button>
      </Space>

      <Space>
        <Button onClick={() => {
          Message.errorDialog({
            content: '失败了！',
            only: false,
          });
        }}>失败1</Button>
        <Button onClick={() => {
          Message.errorDialog({
            content: '失败了！',
          });
        }}>失败2</Button>
      </Space>
    </Space>


  </>;
};

export default Test;
