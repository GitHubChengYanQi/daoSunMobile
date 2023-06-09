import React, { useImperativeHandle, useState } from 'react';
import style from './index.less';
import { useBoolean } from 'ahooks';
import { ImageViewer, ProgressBar, Space } from 'antd-mobile';
import wx from 'populee-weixin-js-sdk';
import UpLoadImg from '../index';
import { request } from '../../../../util/Request';
import { queryString, ToolUtil } from '../../../../util/ToolUtil';
import { CameraOutline, CloseOutline } from 'antd-mobile-icons';
import {
  FileOutlined,
  LoadingOutlined,
  FileExcelOutlined,
  FilePptOutlined,
} from '@ant-design/icons';
import IsDev from '../../../../components/IsDev';
import { Message } from '../../Message';
import MyActionSheet from '../../MyActionSheet';
import MyRemoveButton from '../../MyRemoveButton';
import { Avatar, Upload } from 'antd';
import MyEllipsis from '../../MyEllipsis';
import Icon from '../../Icon';

export const previewImage = (current, urls = []) => {
  wx.ready(() => {
    wx.previewImage({
      current, // 第一张显示的图片链接
      urls, // 需要预加载的图片http链接列表，预加载后，可以滑动浏览这些图片
    });
  });
};

const UploadFile = (
  {
    show,
    files = [],
    onChange = () => {
    },
    file,
    noFile,
    imgSize,
    uploadId = 'myUpload',
    noAddButton,
    loading: getLoading = () => {
    },
    refresh,
    max,
    noDefault,
    fileRender,
  }, ref,
) => {

  const options = [{ text: '图片', key: 'img' }, { text: '拍照', key: 'photo' }];

  if (!noFile) {
    options.push({ text: '文件', key: 'file' });
  }

  const [visible, { setTrue, setFalse }] = useBoolean();

  const [percent, setPercent] = useState(0);

  const [loading, setLoading] = useState();

  const imgs = files.map(item => (item.showUrl || item.url));

  const fileChange = ({ mediaId, url, filedName, type, remove }) => {
    if (!mediaId) {
      Message.errorToast('上传失败!');
      return;
    }
    let newFile;
    if (remove) {
      newFile = files.filter(fileItem => fileItem.mediaId !== mediaId);
    } else {
      newFile = [...files, { type, mediaId, url, filedName }];
    }
    onChange(newFile);
  };

  const uploadImage = (localId, url) => {
    wx.ready(() => {
      wx.uploadImage({
        localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: async (res) => {
          const mediaId = await request({
            url: '/media/getTemporaryFile',
            method: 'GET',
            params: { mediaId: res.serverId },
          });
          fileChange({ type: 'image', mediaId, url });
          getLoading(false);
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
          getLoading(true);
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

  const addFile = () => {
    if (ToolUtil.isQiyeWeixin() && !IsDev()) {
      setTrue();
    } else {
      document.getElementById(uploadId).click();
    }
  };

  const fileIcon = (type) => {
    let icon;
    if (queryString('pdf', type)) {
      icon = <Icon type='icon-PDF' />;
    } else if (queryString('doc', type)) {
      icon = <Icon type='icon-WORD' />;
    } else if (queryString('xls', type)) {
      icon = <FileExcelOutlined />;
    } else if (queryString('ppt', type)) {
      icon = <FilePptOutlined />;
    } else {
      icon = <FileOutlined />;
    }
    return icon;
  };

  useImperativeHandle(ref, () => ({
    addFile,
  }));

  return <>

    {!file && <div className={style.imgs}>
      {
        files.map((item, index) => {
          return <div key={index} className={style.img} style={{ width: imgSize, height: imgSize }}>
            <div hidden={show} className={style.remove}>
              <MyRemoveButton
                onRemove={() => {
                  fileChange({ mediaId: item.mediaId, remove: true });
                }}
                dom={CloseOutline}
              />
            </div>
            <Avatar
              shape='square'
              size={60}
              src={item.url}
              icon={fileIcon(item.type)}
              className={style.showImg}
              onClick={() => {
                if (!ToolUtil.isQiyeWeixin()) {
                  ImageViewer.Multi.show({
                    images: imgs,
                    defaultIndex: index,
                  });
                  return;
                }
                previewImage(item.showUrl || item.url, imgs);
              }}
            />
          </div>;
        })
      }

      <div hidden={!loading} className={style.img} style={{ width: imgSize, height: imgSize }}>
        <LoadingOutlined />
      </div>

      <div
        hidden={show || noAddButton || files.length === max}
        className={style.img}
        style={{ width: imgSize, height: imgSize }}
        onClick={() => addFile()}>
        <CameraOutline />
      </div>
    </div>}

    {file && [...files, { loading: true }].map((item, index) => {
      if (item.loading) {
        if (!loading) {
          return <div key={index} />;
        }
        return <div key={index}>
          <Space><LoadingOutlined /><span style={{ fontSize: 12 }}>上传中</span></Space>
          <ProgressBar
            percent={percent}
            style={{
              '--track-width': '4px',
            }}
          />
        </div>;
      }

      if (typeof fileRender === 'function') {
        return <div key={index} style={{ display: 'inline-block' }}>{fileRender({
          ...item,
          icon: fileIcon(item.type),
        })}</div>;
      }
      return <div className={style.fileItem} key={index}>
        <Avatar shape='square' size={26} src={item.url} icon={fileIcon(item.type)} className={style.showImg} />
        <MyEllipsis>{item.filedName || ''}</MyEllipsis>
        {!show && <MyRemoveButton
          className={style.remove}
          onRemove={() => fileChange({ mediaId: item.mediaId, remove: true })}
        />}
      </div>;
    })}

    <UpLoadImg
      hidden
      onPercent={setPercent}
      uploadLoading={(loading) => {
        getLoading(loading);
        setLoading(loading);
      }}
      // value={files.map(item => item.url)}
      maxCount={5}
      type='picture'
      id={uploadId}
      onChange={(url, mediaId, file) => {
        setPercent(0);
        fileChange({ type: file.type, mediaId, url, filedName: file.name });
        setFalse();
      }}
    />


    <MyActionSheet
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

export default React.forwardRef(UploadFile);
