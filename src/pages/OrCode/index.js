import { useDebounceEffect } from 'ahooks';
import { connect } from 'dva';
import MyEmpty from '../components/MyEmpty';
import { ScanOutlined } from '@ant-design/icons';
import React from 'react';
import LinkButton from '../components/LinkButton';

// https://dasheng-soft.picp.vip/#/OrCode?id=1475666613936861185

const OrCode = (props) => {

  const id = props.location.query.id;

  useDebounceEffect(() => {
    if (id) {
      props.dispatch({
        type: 'qrCode/backObject',
        payload: {
          code: id,
        },
      });
    } else {
      props.dispatch({
        type: 'qrCode/wxCpScan',
      });
    }
  }, [], {
    wait: 0,
  });


  return <MyEmpty height='100vh' description={<LinkButton onClick={() => {
    props.dispatch({
      type: 'qrCode/wxCpScan',
    });
  }} title={<><ScanOutlined />点击扫码</>} />} />;
};
export default connect(({ qrCode }) => ({ qrCode }))(OrCode);
