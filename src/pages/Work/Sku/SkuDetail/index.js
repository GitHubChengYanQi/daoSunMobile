import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { useLocation } from 'react-router-dom';
import style from './index.less';
import MyCard from '../../../components/MyCard';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import UploadFile from '../../../components/Upload/UploadFile';
import { CameraOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../components/ToolUtil';
import { Message } from '../../../components/Message';

export const editEnclosure = { url: '/sku/editEnclosure', method: 'POST' };

const SkuDetail = ({ id }) => {

  const { query } = useLocation();

  const skuId = id || query.skuId;

  const [detail, setDetail] = useState();

  const { loading, run, refresh } = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      const detail = res || {};
      const imgs = detail.images ? ToolUtil.isArray(detail.images.split(',')).map((item, index) => {
        const url = ToolUtil.isArray(detail.imgUrls)[index];
        return {
          url,
          mediaId: item,
        };
      }) : [];

      const files = detail.fileId ? ToolUtil.isArray(detail.fileId.split(',')).map((item, index) => {
        const url = ToolUtil.isArray(detail.filedUrls)[index];
        return {
          url,
          mediaId: item,
        };
      }) : [];

      const drawings = detail.drawing ? ToolUtil.isArray(detail.drawing.split(',')).map((item, index) => {
        const url = ToolUtil.isArray(detail.drawingUrls)[index];
        return {
          url,
          mediaId: item,
        };
      }) : [];
      setDetail({ ...detail, imgs, files, drawings });
    },
  });

  const { loading: editLoading, run: edit } = useRequest(editEnclosure, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
    onError: () => {
      Message.errorToast('修改失败!', () => {
        refresh();
      });
    },
  });

  useEffect(() => {
    if (skuId) {
      run({ data: { skuId } });
    }
  }, []);

  if (loading && !detail) {
    return <MyLoading skeleton />;
  }

  if (!detail) {
    return <MyEmpty />;
  }

  const editAction = (newData = {}) => {
    edit({ data: { skuId, images: detail.images, fileId: detail.fileId, drawing: detail.drawing, ...newData } });
  };

  return <div className={style.skuDetail}>
    <MyNavBar title='物料详情' />
    <MyCard title='基本信息'>
      <div className={style.item}>
        <Label className={style.label}>物料编码：</Label>
        {detail.standard}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料分类：</Label>
        {detail.spuResult && detail.spuResult.spuClassificationResult && detail.spuResult.spuClassificationResult.name}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料名称：</Label>
        {detail.spuResult && detail.spuResult.name}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料型号：</Label>
        {detail.skuName}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料规格：</Label>
        {detail.specifications}
      </div>
      <div className={style.item}>
        <Label
          className={style.label}>单位：</Label>
        {detail.spuResult && detail.spuResult.unitResult && detail.spuResult.unitResult.unitName}
      </div>
      <div className={style.item}>
        <Label className={style.label}>品牌：</Label>
        {detail.brandResults && detail.brandResults.map((item) => item.brandName).join(',')}
      </div>
      <div className={style.item}>
        <Label className={style.label}>创建人：</Label>
        {ToolUtil.isObject(detail.user).name}
      </div>
    </MyCard>
    <MyCard title='描述信息'>
      <div className={style.imgInfo}>
        <Label className={style.label}>
          图片:
        </Label>
        <UploadFile
          noDefault
          uploadId='imgUpload'
          files={detail.imgs}
          max={3}
          noFile
          icon={<CameraOutline />}
          onChange={(medias) => {
            console.log(medias);
            editAction({ images: medias.map(item => item.mediaId).toString() });
          }}
        />
      </div>

      <div className={style.imgInfo}>
        <Label className={style.label}>
          附件:
        </Label>
        <UploadFile
          noDefault
          max={3}
          uploadId='fileUpload'
          files={detail.files}
          noFile
          icon={<CameraOutline />}
          onChange={(medias) => {
            editAction({ fileId: medias.map(item => item.mediaId).toString() });
          }}
        />
      </div>

      <div className={style.imgInfo}>
        <Label className={style.label}>
          关联图纸:
        </Label>
        <UploadFile
          noDefault
          max={3}
          uploadId='drawingUpload'
          files={detail.drawings}
          noFile
          icon={<CameraOutline />}
          onChange={(medias) => {
            editAction({  drawing: medias.map(item => item.mediaId).toString() });
          }}
        />
      </div>

    </MyCard>

    {(editLoading || loading) && <MyLoading />}
  </div>;
};

export default SkuDetail;
