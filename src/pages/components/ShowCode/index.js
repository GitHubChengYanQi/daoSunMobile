import React, { useState } from 'react';
import { Dialog } from 'antd-mobile';
import jrQrcode from 'jr-qrcode';
import PrintCode from '../PrintCode';
import { ToolUtil } from '../ToolUtil';
import { QrCodeIcon } from '../Icon';

const ShowCode = ({ code }) => {

  const [open, setOpen] = useState();

  return <>
    <QrCodeIcon style={{color:'var(--adm-color-primary)'}} onClick={() => setOpen(code)} />
    <Dialog
      visible={open}
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
            setOpen('');
            return;
          case 'print':
            PrintCode.print([`<img src=${jrQrcode.getQrBase64(code)} alt='' />`], 0);
            return;
          default:
            return;
        }
      }}
    />
  </>;
};

export default ShowCode;
