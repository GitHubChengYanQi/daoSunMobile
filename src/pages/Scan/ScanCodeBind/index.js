import React, { useEffect, useImperativeHandle, useState } from 'react';
import { request } from '../../../util/Request';

const ScanCodeBind = (
  {
    onBind, // 绑定
    onCodeId, // 已绑定
    action,
    ...props
  }, ref) => {

  const [item, setItem] = useState();

  // 判断二维码状态
  const code = async (codeId, backObject, items) => {

    const isBind = await request(
      {
        url: '/orCode/isNotBind',
        method: 'POST',
        data: {
          codeId: codeId,
        },
      },
    );
    // 判断是否是未绑定过的码
    if (isBind) {
      //如果已绑定
      typeof onCodeId === 'function' && onCodeId(codeId, backObject, items);
    } else {
      //如果未绑定
      typeof onBind === 'function' && onBind(codeId, backObject, items);
    }
    setItem(null);
  };

  const scanCode = (items) => {
    setItem(items);
    if (items) {
      props.dispatch({
        type: 'qrCode/wxCpScan',
        payload: {
          action,
        },
      });

    }
  };

  useEffect(() => {
    if (props.qrCode.codeId && item) {
      code(props.qrCode.codeId, props.qrCode.backObject, item);
    }
  }, [props.qrCode.codeId]);

  useImperativeHandle(ref, () => ({
    scanCode,
  }));

  return <></>;

};

export default React.forwardRef(ScanCodeBind);
