import React, { useState } from 'react';
import style from './index.less';
import add from '../../../../assets/add-file.png';
import { useBoolean } from 'ahooks';
import { ActionSheet, Toast } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import UpLoadImg from '../index';
import { request } from '../../../../util/Request';
import { ToolUtil } from '../../ToolUtil';
import { Upload } from 'antd';
import { CloseOutline } from 'antd-mobile-icons';
import { MyLoading } from '../../MyLoading';

const UploadFile = () => {

  const [visible, { setTrue, setFalse }] = useBoolean();

  const [files, setFiles] = useState([]);
  const imgs = files.filter(item => ToolUtil.queryString('image', item.type));
  const picture = files.filter(item => !ToolUtil.queryString('image', item.type));

  const [loading, setLoading] = useState();

  const uploadImage = (localId, url) => {
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
          setFiles([...files, { type: 'image', mediaId, url }]);
        } catch (e) {
          Toast.show({ content: '上传失败！' });
        }

        setFalse();
        setLoading(false);
      },
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
        switch (action.key) {
          case 'img':
            chooseImage('album');
            break;
          case 'photo':
            chooseImage('camera');
            break;
          case 'file':
            const fileDom = document.getElementById('file');
            fileDom.setAttribute('accept', 'application/*,.pdf');
            fileDom.click();
            break;
          default:
            break;
        }
      }}
    />

    {loading && <MyLoading title='上传中...' />}

  </>;
};

export default UploadFile;
