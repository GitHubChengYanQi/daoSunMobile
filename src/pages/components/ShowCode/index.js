import React, { useState } from 'react';
import { Dialog, Loading } from 'antd-mobile';
import jrQrcode from 'jr-qrcode';
import PrintCode from '../PrintCode';
import { ToolUtil } from '../ToolUtil';
import { QrCodeIcon } from '../Icon';
import { useRequest } from '../../../util/Request';

const inkindDetail = { url: '/inkind/detail', method: 'POST' };

const ShowCode = ({ code, inkindId }) => {

  const [open, setOpen] = useState();

  const { loading, run } = useRequest(inkindDetail, {
    manual: true,
    onSuccess: (res) => {
      PrintCode.print([ToolUtil.isObject(res.printTemplateResult).templete], 0);
    },
  });

  return <>
    <QrCodeIcon style={{ color: 'var(--adm-color-primary)' }} onClick={() => setOpen(code)} />
    <Dialog
      visible={open}
      content={<div style={{ textAlign: 'center' }}>
        <img src={jrQrcode.getQrBase64(code)} alt='' />
      </div>}
      actions={[[
        { text: '取消', key: 'close' },
        { text: loading ? <Loading /> : '打印二维码', key: 'print', disabled: ToolUtil.isQiyeWeixin() },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            setOpen('');
            return;
          case 'print':
            run({ data: { inkindId } });
            return;
          default:
            return;
        }
      }}
    />
  </>;
};

export default ShowCode;
