import React, { useImperativeHandle } from 'react';
import { request } from '../../../util/Request';
import { connect } from 'dva';

const testCodeId = '1470279322124427265';

const ScanCodeBind = React.forwardRef((
  {
    onBind,// 绑定
    onCodeId, // 已绑定
    ...props
  }, ref) => {


  // 判断二维码状态
  const code = async (codeId) => {

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
      typeof onCodeId === 'function' && onCodeId(codeId);
    } else {
      typeof onBind === 'function' && onBind(codeId);
    }
  };

  // 开启扫码
  const scan = async (items) => {
    if (items) {
      if (process.env.NODE_ENV === 'development') {
        code(testCodeId, items);
      } else {
       await props.dispatch({
          type: 'qrCode/wxCpScan',
        });
        if (props.qrCode.code){
          code(props.qrCode.code)
        }
      }
    }
  };


  const scanCode = (items) => {
    scan(items);
  };

  useImperativeHandle(ref, () => ({
    scanCode,
  }));

  return <></>;

});
export default connect(({ qrCode }) => ({ qrCode }))(ScanCodeBind);
