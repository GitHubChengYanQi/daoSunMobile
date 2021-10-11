import React, { useState } from 'react';
import { Steps } from 'antd-mobile';
import {
  SegmentedControl,
} from 'weui-react-v2';

const Dynamic = () => {

  const [value, setValue] = useState('0');

  const content = () => {
    switch (value) {
      case '0':
        return (
          <div style={{padding:16}}>
            <Steps size="small" current={2} direction='vertical'>
              <Steps.Step title="User 2021-05-06" description="操作" />
              <Steps.Step title="User 2021-05-06" description="操作" />
              <Steps.Step title="User 2021-05-06" description="操作" />
            </Steps>
          </div>
        );
      case '1':
        return (
          <>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <SegmentedControl
        data={[{ label: '按时间', value: '0' }, { label: '按客户', value: '1' }]}
        defaultValue='0'
        onChange={(val) => setValue(val)} />
      {content()}

    </>
  );
};

export default Dynamic;
