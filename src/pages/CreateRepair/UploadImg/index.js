import UpLoadImg from '../../components/Upload';
import { useState } from 'react';
import { useDebounceEffect } from 'ahooks';
import { Space } from 'antd-mobile';


const UploadImg = ({onChange,value}) => {

  const [imgs,setImgs] = useState({one:{},two:{},three:{},});


  useDebounceEffect(()=>{
    const img = [imgs.one || null, imgs.two || null, imgs.three || null];
    onChange(img);
  },[imgs],{
    wait:0
  })



  return (
    <Space direction='horizontal'>
      <UpLoadImg onChange={(value)=>{
        setImgs({...imgs, one: {imgUrl: value, title: '报修设备图片'}});
      }} />
      <UpLoadImg onChange={(value)=>{
        setImgs({...imgs, two: {imgUrl: value, title: '报修设备图片'}});
      }} />
      <UpLoadImg onChange={(value)=>{
        setImgs({...imgs, three: {imgUrl: value, title: '报修设备图片'}});
      }} />
    </Space>
  );
};

export default UploadImg;
