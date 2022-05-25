import React, { useState } from 'react';
import style from './index.less';
import add from '../../../../assets/add-file.png';
import { useBoolean } from 'ahooks';
import { ActionSheet, Button, Toast } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import UpLoadImg from '../index';
import { useRequest } from '../../../../util/Request';
import cookie from 'js-cookie';
import { ToolUtil } from '../../ToolUtil';
import { Upload } from 'antd';
import { useModel } from 'umi';
import { CloseOutline } from 'antd-mobile-icons';
import img from '../../../../assets/hunts2Logo.png';

const UploadFile = () => {

  const { initialState } = useModel('@@initialState');

  const state = initialState || {};

  const [visible, { setTrue, setFalse }] = useBoolean();

  const [files, setFiles] = useState([]);
  const imgs = files.filter(item => ToolUtil.queryString('image', item.type));
  const picture = files.filter(item => !ToolUtil.queryString('image', item.type));

  const [loading, setLoading] = useState();

  const dataURLtoBlob = (dataurl) => {//base64转file
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], mime.split('/').join('.'), {
      type: mime,
    });
  };

  const getSTSToken = {
    url: '/media/getToken', // 获取OSS凭证接口
    data: {},
  };

  const { run: getOssObj } = useRequest(getSTSToken, {
    manual: true,
  });

  const getBase64FromImageURL = (url) => {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var base64URL = canvas.toDataURL('image/png');
      console.log(base64URL);
      canvas = null;
    };
    img.src = url;
  };


  const ossUpload = async (file) => {
    const res = await getOssObj({ params: { type: file.name } });
    if (!res) {
      return;
    }
    const formData = new FormData();
    formData.append('key', res.key);
    formData.append('policy', res.policy);
    formData.append('Signature', res.Signature);
    formData.append('OSSAccessKeyId', res.OSSAccessKeyId);
    formData.append('file', file);

    fetch(res.host, {
      method: 'POST',
      headers: { Authorization: cookie.get('cheng-token') },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        setFiles([...files, { name: file.name, type: file.type, mediaId: res.mediaId, url: `${res.host}/${res.key}` }]);
      } else {
        Toast.show({ content: '上传失败！', position: 'bottom' });
      }
    }).finally(() => {
      setLoading(false);
      setFalse();
    });
  };

  const chooseImage = (sourceType) => {
    wx.ready(() => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [sourceType], // 可以指定来源是相册还是相机，默认二者都有
        defaultCameraMode: 'batch', //表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。从3.0.26版本开始支持front和batch_front两种值，其中front表示默认为前置摄像头单拍模式，batch_front表示默认为前置摄像头连拍模式。（注：用户进入拍照界面仍然可自由切换两种模式）
        isSaveToAlbum: 1, //整型值，0表示拍照时不保存到系统相册，1表示自动保存，默认值是1
        success: (res) => {
          console.log(res);
          setLoading(true);
          const localIds = res.localIds; // 返回选定照片的本地ID列表，
          const u = navigator.userAgent;
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isiOS) {
            wx.getLocalImgData({
              localId: localIds[0], // 图片的localID
              success: (res) => {
                ossUpload(dataURLtoBlob(res.localData));
              },
            });
          } else {
            console.log(localIds[0]);
            getBase64FromImageURL(localIds[0]);
          }
        },
      });
    });
  };

  // https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20220525/20220525304787.png

  return <>

    <div className={style.imgs}>
      {
        imgs.map((item, index) => {
          return <div key={index} className={style.img}>
            <div className={style.remove} onClick={() => {
              setFiles(files.filter(fileItem => fileItem.mediaId !== item.mediaId));
            }}><CloseOutline /></div>
            <img src={item.url} alt='' width='100%' height='100%' />
          </div>;
        })
      }

      <div className={style.img} onClick={() => {
        if (ToolUtil.isQiyeWeixin()) {
          setTrue();
        } else {
          document.getElementById('file').click();
        }
      }}>
        <img src={add} alt='' width='100%' height='100%' />
      </div>
    </div>

    <Upload
      className='avatar-uploader'
      fileList={picture}
      listType='picture'
      onRemove={(file) => {
        setFiles(files.filter(item => item.mediaId !== file.mediaId));
      }}
    />

    <UpLoadImg
      maxCount={5}
      type='picture'
      id='file'
      onChange={(url, mediaId, file) => {
        setFiles([...files, { type: file.type, mediaId, url, name: file.name }]);
        setFalse();
      }}
      button
    />


    <ActionSheet
      className={style.action}
      cancelText='取消'
      visible={visible}
      actions={[{ text: '图片', key: 'img' }, { text: '拍照', key: 'photo' }, { text: '文件', key: 'file' }]}
      onClose={setFalse}
      onAction={(action) => {
        const fileDom = document.getElementById('file');
        switch (action.key) {
          case 'img':
            fileDom.setAttribute('accept', 'image/*');
            fileDom.removeAttribute('capture');
            // chooseImage('album');
            break;
          case 'photo':
            fileDom.setAttribute('accept', 'image/*');
            fileDom.setAttribute('capture', '');
            // chooseImage('camera');
            break;
          case 'file':
            fileDom.setAttribute('accept', 'application/*,.pdf');
            fileDom.removeAttribute('capture');
            break;
          default:
            break;
        }
        fileDom.click();
      }}
    />

    {/*{loading && <MyLoading title='上传中...' />}*/}

  </>;
};

export default UploadFile;
