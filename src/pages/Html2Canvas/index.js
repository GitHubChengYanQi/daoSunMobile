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

  const canvas = () => new Promise((resolve) => {
    html2canvas(document.getElementById('code'), {
      scale: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      resolve(canvas);
    });
  });

  const htmlString = `
      <!DOCTYPE html>
        <html>
          <head>
              <meta charset='utf-8' />
              <meta
                 name='viewport'
                 content='width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
              />
          </head>
          <body>
            <div style='max-width:384px;max-height: 230px;overflow-y: hidden'>${templete}</div>
          </body>
        </html>
`;

  const canvasBase64 = () => {
    window.Android && window.Android.nPrint(htmlString);
    setCodeId(null);
    Toast.show({
      icon: 'loading',
      duration: 0,
      content: '打印中...',
    });
    // setTimeout(async () => {
    //   const response = await canvas();
    //   typeof success === 'function' && success(codeId);
    //   if (process.env.ENV === 'test') {
    //     Toast.clear();
    //   }
    //   window.Android && window.Android.print(response.toDataURL().split(',')[1]);
    //   // setCodeId(null);
    // }, 0);
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
    afterShow={() => {
      canvasBase64();
    }}
    content={<div>
      <div
        id='code'
        style={{
          display: 'inline-block',
          margin: 'auto',
          maxWidth: 'device-width',
          maxHeight: 250,
          overflow: 'auto',
        }}>
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
  />;
};

export default React.forwardRef(Html2Canvas);
