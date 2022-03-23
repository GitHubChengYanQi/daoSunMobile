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

  return <div style={{ backgroundColor: '#fff' }}>
    <div style={{ display: 'flex' }}>
      <LinkButton style={{ paddingRight:8 }} onClick={() => {
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
      <div style={{ flexGrow: 1 }}>
        {loading ? <Loading /> :
          <Input value={value || ''} placeholder='请输入编码' onChange={onChange} />}
      </div>
    </div>

  </div>;
};

export default MyCoding;
