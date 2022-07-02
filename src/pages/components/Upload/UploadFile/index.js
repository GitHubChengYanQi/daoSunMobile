import React, { useState } from 'react';
import style from './index.less';
import add from '../../../../assets/add-file.png';
import { useBoolean } from 'ahooks';
import { ActionSheet, Toast } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import UpLoadImg from '../index';
import { request } from '../../../../util/Request';
import { ToolUtil } from '../../ToolUtil';
import { CloseOutline } from 'antd-mobile-icons';
import { FileOutlined, LoadingOutlined } from '@ant-design/icons';

const UploadFile = (
  {
    show,
    value = [],
    onChange = () => {
    },
    noFile,
    icon,
    imgSize,
    uploadId = 'myUpload',
  },
) => {

  const options = [{ text: '图片', key: 'img' }, { text: '拍照', key: 'photo' }];

  if (!noFile) {
    options.push({ text: '文件', key: 'file' });
  }

  const [visible, { setTrue, setFalse }] = useBoolean();

  const [files, setFiles] = useState(value);

  const [loading, setLoading] = useState();

  const fileChange = ({ mediaId, url, type, remove }) => {
    let newFile;
    if (remove) {
      newFile = files.filter(fileItem => fileItem.mediaId !== mediaId);
    } else {
      newFile = [...files, { type, mediaId, url }];
    }
    onChange(newFile.map(item => item.mediaId));
    setFiles(newFile);
  };

  const uploadImage = (localId, url) => {
    wx.ready(() => {
      wx.uploadImage({
        localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: async (res) => {
          try {
            const mediaId = await request({
              url: '/media/getTemporaryFile',
              method: 'GET',
              params: { mediaId: res.serverId },
            });
            fileChange({ type: 'image', mediaId, url });
          } catch (e) {
            Toast.show({ content: '上传失败！' });
          }
          setLoading(false);
        },
      });
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
          setLoading(true);
          setFalse();
          const localIds = res.localIds; // 返回选定照片的本地ID列表，
          const u = navigator.userAgent;
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isiOS) {
            wx.getLocalImgData({
              localId: localIds[0], // 图片的localID
              success: (res) => {
                uploadImage(localIds[0], res.localData);
              },
            });
          } else {
            uploadImage(localIds[0], localIds[0]);
          }
        },
      });
    });
  };

  return <>

    <div className={style.imgs}>
      {
        files.map((item, index) => {
          return <div key={index} className={style.img} style={{ width: imgSize, height: imgSize }}>
            <div hidden={show} className={style.remove} onClick={() => {
              fileChange({ mediaId: item.mediaId, remove: true });
            }}><CloseOutline /></div>
            {
              typeof item.url === 'object' ? <FileOutlined style={{color:'var(--adm-color-primary)'}} /> :
                <img src={item.url} alt='' width='100%' height='100%' nonce={<FileOutlined />} onError={() => {
                  const newFile = files.map((currentItem, currentIndex) => {
                    if (currentIndex === index) {
                      return { ...currentItem, url: <FileOutlined /> };
                    } else {
                      return currentItem;
                    }
                  });
                  setFiles(newFile);
                }} />
            }

          </div>;
        })
      }

      <div hidden={!loading} className={style.img} style={{ width: imgSize, height: imgSize }}>
        <LoadingOutlined />
      </div>

      <div hidden={show} className={style.img} style={{ width: imgSize, height: imgSize }} onClick={() => {
        if (ToolUtil.isQiyeWeixin()) {
          setTrue();
        } else {
          document.getElementById(uploadId).click();
        }
      }}>
        {icon || <img src={add} alt='' width='100%' height='100%' />}
      </div>
    </div>

    <UpLoadImg
      hidden
      uploadLoading={setLoading}
      maxCount={5}
      type='picture'
      id={uploadId}
      onChange={(url, mediaId, file) => {
        fileChange({ type: file.type, mediaId, url, name: file.name });
        setFalse();
      }}
    />


    <ActionSheet
      className={style.action}
      cancelText='取消'
      visible={visible}
      actions={options}
      onClose={setFalse}
      onAction={(action) => {
        switch (action.key) {
          case 'img':
            chooseImage('album');
            break;
          case 'photo':
            chooseImage('camera');
            break;
          case 'file':
            const fileDom = document.getElementById(uploadId);
            fileDom.setAttribute('accept', 'application/*,.pdf');
            fileDom.click();
            break;
          default:
            break;
        }
      }}
    />

  </>;
};

export default UploadFile;
