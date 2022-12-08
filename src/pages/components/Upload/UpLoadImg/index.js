import React, { useState } from 'react';
import style from '../UploadFile/index.less';
import { CloseOutline } from 'antd-mobile-icons';
import add from '../../../../assets/add-file.png';
import UpLoadImg from '../index';
import { LoadingOutlined } from '@ant-design/icons';

const UpLoadImgs = (
  {
    maxCount,
    onChange = () => {
    },
  },
) => {

  const [imgs, setImgs] = useState([]);

  const [uploadLoading, setUploadLoading] = useState();

  return <>
    <div className={style.imgs}>
      {
        imgs.map((item, index) => {
          return <div key={index} className={style.img}>
            <div className={style.remove} onClick={() => {

            }}><CloseOutline /></div>
            <img src={item.url} alt='' width='100%' height='100%' />
          </div>;
        })
      }


      <div hidden={!uploadLoading} className={style.img}>
        <LoadingOutlined />
      </div>

      <div className={style.img} onClick={() => {
        document.getElementById('img').click();
      }}>
        <img src={add} alt='' width='100%' height='100%' />
      </div>
    </div>

    <UpLoadImg
      uploadLoading={setUploadLoading}
      maxCount={maxCount || 5}
      type='picture'
      id='img'
      onChange={(url, mediaId) => {
        setImgs([...imgs, { mediaId, url }]);
        onChange([...imgs, { mediaId, url }]);
      }}
      button
    />

  </>;
};

export default UpLoadImgs;
