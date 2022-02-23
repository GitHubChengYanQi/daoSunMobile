import React, { useEffect, useState } from 'react';
import { Input, Loading, Radio, Space } from 'antd-mobile';
import { useRequest } from '../../../util/Request';

const MyCoding = (
  {
    module,
    value,
    onChange = () => {
    },
  }) => {

  const [state, setState] = useState('auto');

  const { loading, run } = useRequest({
    url: '/codingRules/defaultEncoding',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      onChange(res);
    },
  });

  useEffect(() => {
    if (module !== undefined) {
      run({
        params: {
          type: module,
        },
      });
    }
  }, []);

  return <Space direction='vertical' style={{ backgroundColor: '#fff' }}>
    <Radio.Group
      value={state}
      onChange={(value) => {
        if (value === 'auto') {
          run({
            params: {
              type: module,
            },
          });
        }
        onChange(null);
        setState(value);
      }}
    >
      <Space>
        <Radio value='auto'>自动生成</Radio>
        <Radio value='action'>手动输入</Radio>
      </Space>
    </Radio.Group>
    {loading ? <Loading /> : <Input value={value || ''} placeholder='请输入编码' onChange={onChange} />}
  </Space>;
};

export default MyCoding;
