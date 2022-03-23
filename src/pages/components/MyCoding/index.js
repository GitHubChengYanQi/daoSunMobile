import React, { useEffect, useState } from 'react';
import { ActionSheet, Input, Loading, Radio, Space } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import LinkButton from '../LinkButton';

const MyCoding = (
  {
    module,
    value,
    onChange = () => {
    },
  }) => {

  const [auto, setAuto] = useState(true);

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
    <Space>
      <LinkButton onClick={() => {
        if (!auto) {
          run({
            params: {
              type: module,
            },
          });
        }
        onChange(null);
        setAuto(!auto);
      }}>{auto ? '自动生成' : '手动输入'}</LinkButton>
      {loading ? <Loading /> :
        <Input value={value || ''}  placeholder='请输入编码' onChange={onChange} />}
    </Space>

  </Space>;
};

export default MyCoding;
