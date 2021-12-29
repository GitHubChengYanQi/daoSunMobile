import React, { useImperativeHandle, useState } from 'react';
import html2canvas from 'html2canvas';
import { Dialog } from 'antd-mobile';
import pares, { attributesToProps } from 'html-react-parser';

const Html2Canvas = ({ ...props }, ref) => {

  const [codeId, setCodeId] = useState();
  const [templete, setTemplete] = useState();

  const canvasBase64 = () => {
    html2canvas(document.getElementById('code'), {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      console.log('打印二维码', codeId);
      window.Android && window.Android.print(canvas.toDataURL().split(',')[1]);
      setCodeId(null);
    });
    return null;
  };


  useImperativeHandle(ref, () => ({
    setCodeId,
    setTemplete,
  }));


  return <Dialog
    visible={codeId}
    content={<div>
      <div id='code' style={{ display: 'inline-block',margin:'auto' }}>
        {templete ?
          pares(templete, {
            replace: domNode => {
              if (domNode.name === 'p'){
                domNode.attribs = {
                  padding:0,
                  margin:0
                }
                console.log(domNode);
                return domNode;
              }
            }
          })
          :
          '暂无'}</div>
    </div>}
    onAction={() => {
      canvasBase64();
    }}
    actions={[{
      key: 'pring',
      text: '打印二维码',
    }]}
  />;
};

export default React.forwardRef(Html2Canvas);
