import React, { useImperativeHandle, useState } from 'react';
import { Dialog } from 'antd-mobile';
import jrQrcode from 'jr-qrcode';
import PrintCode from '../PrintCode';
import { ToolUtil } from '../ToolUtil';

const ShowCode = ({ props }, ref) => {

  const [code, setCode] = useState();

  const openCode = (code) => {
    setCode(code);
  };

  useImperativeHandle(ref, () => ({ openCode }));

  return <>
    <Dialog
      visible={code}
      content={<div style={{ textAlign: 'center' }}>
        <img src={jrQrcode.getQrBase64(code)} alt='' />
      </div>}
      actions={[[
        { text: '取消', key: 'close' },
        { text: '打印二维码', key: 'print', disabled: ToolUtil.isQiyeWeixin() },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            setCode('');
            return;
          case 'print':
            PrintCode.print([`<img src={${jrQrcode.getQrBase64(code)}} alt='' />`], 0);
            return;
          default:
            return;
        }
      }}
    />
  </>;
};

export default React.forwardRef(ShowCode);
