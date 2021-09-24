import React, { useState } from 'react';
import { SafeArea, SegmentedControl, WingBlank } from 'weui-react-v2';

const Report = () => {

  const [page,setPage] = useState();

  const data = [
    {
      label: '公司运营',
      value: 'gsyy',
    },
    {
      label: '售后统计',
      value: 'shtj',
    },
    {
      label: '库存统计',
      value: 'kctj',
    },
  ];

  return (
    <SafeArea style={{ margin: '-0.16rem', minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '5px 0 10px' }}>
      <WingBlank size='sm'>
        <SegmentedControl
          data={data}
          style={{ backgroundColor: '#fff' }}
          defaultValue='gsyy'
          onChange={(val) => setPage(val)} />
      </WingBlank>
    </SafeArea>
  );
};

export default Report;
