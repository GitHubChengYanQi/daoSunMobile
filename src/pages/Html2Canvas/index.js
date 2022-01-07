import React, { useEffect, useImperativeHandle, useState } from 'react';
import html2canvas from 'html2canvas';
import { Dialog, Toast } from 'antd-mobile';
import pares from 'html-react-parser';

const Html2Canvas = ({ success, close, ...props }, ref) => {

  const [codeId, setCodeId] = useState();
  const [disabled, setDisabled] = useState(false);
  const [templete, setTemplete] = useState();

  const actions = () => {
    if (close) {
      return [{
        disabled,
        key: 'print',
        text: '打印二维码',
      }, {
        key: 'close',
        text: '取消',
      }];
    } else {
      return [{
        disabled,
        key: 'print',
        text: '打印二维码',
      }];
    }
  };

  const canvasBase64 = () => {
    Toast.show({
      icon: 'loading',
      duration: 0,
      content: '打印中...',
    });
    html2canvas(document.getElementById('code'), {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      console.log('打印二维码', codeId);
      typeof success === 'function' && success(codeId);
      window.Android && window.Android.print(canvas.toDataURL().split(',')[1]);
      setCodeId(null);
    });
    return null;
  };


  useImperativeHandle(ref, () => ({
    setCodeId,
    setTemplete,
  }));

  useEffect(() => {
    if (codeId) {
      setDisabled(false);
    }
  }, [codeId]);


  return <Dialog
    visible={codeId}
    content={<div>
      <div id='code' style={{ display: 'inline-block', margin: 'auto', maxWidth: 200, maxHeight: 200 }}>
        {templete ?
          pares(templete, {
            replace: domNode => {
              if (domNode.name === 'p') {
                domNode.attribs = {
                  style: 'padding:0;margin:0',
                };
                return domNode;
              }
            },
          })
          :
          '暂无'}</div>
    </div>}
    onAction={(action) => {
      if (action.key === 'print') {
        canvasBase64();
        setDisabled(true);
      } else {
        setCodeId(null);
      }
    }}
    actions={actions()}
  />;
};

export default React.forwardRef(Html2Canvas);
