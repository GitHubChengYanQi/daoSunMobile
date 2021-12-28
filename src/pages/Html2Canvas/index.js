import React, { useImperativeHandle, useState } from 'react';
import html2canvas from 'html2canvas';
import jrQrcode from 'jr-qrcode';
import { Dialog, Space } from 'antd-mobile';

const Html2Canvas = ({ ...props }, ref) => {

  const [codeId, setCodeId] = useState();
  const [items, setItems] = useState();

  const getItemsResult = () => {
    if (items)
      return <>
        {items.sku && items.sku.skuName}
        &nbsp;/&nbsp;
        {items.spuResult && items.spuResult.name}
        <br />
        {
          items.backSkus
          &&
          items.backSkus.length > 0
          &&
          items.backSkus[0].attributeValues
          &&
          items.backSkus[0].attributeValues.attributeValues
          &&
          <em style={{ color: '#c9c8c8', fontSize: 12 }}>
            (
            {
              items.backSkus
              &&
              items.backSkus.map((items, index) => {
                return <span key={index}>
                        {items.itemAttribute.attribute}：{items.attributeValues.attributeValues}
                      </span>;
              })
            }
            )
          </em>
        }
        <br />
        {items.brandResult && items.brandResult.brandName}
        <br />
        × {items.number}
      </>;
  };

  const canvasBase64 = () => {
    html2canvas(document.getElementById('code'), {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      window.Android && window.Android.print(canvas.toDataURL().split(',')[1]);
      setCodeId(null);
    });
    return null;
  };


  useImperativeHandle(ref, () => ({
    setCodeId,
    setItems,
  }));


  return <Dialog
    visible={codeId}
    content={<div style={{ textAlign: 'center' }}>
      <div id='code' style={{ display: 'inline-block', textAlign: 'center', width: 200 }}>
        <Space>
          <div style={{ width: 100 }}>
            {getItemsResult() || '暂无物料'}
          </div>
          <img
            id='img'
            src={jrQrcode.getQrBase64(`${process.env.wxCp}OrCode?id=${codeId}`)}
            alt=''
            width={100}
            height={100} />
        </Space>
      </div>
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
