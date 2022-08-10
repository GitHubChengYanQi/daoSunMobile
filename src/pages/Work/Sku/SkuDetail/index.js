import React, { useEffect } from 'react';
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

  const { loading, data, run, refresh } = useRequest(skuDetail, { manual: true });

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

  if (loading && !data) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const imgs = data.images ? ToolUtil.isArray(data.images.split(',')).map((item, index) => {
    const url = ToolUtil.isArray(data.imgUrls)[index];
    return {
      url,
      mediaId: item,
    };
  }) : [];

  const files = data.fileId ? ToolUtil.isArray(data.fileId.split(',')).map((item, index) => {
    const url = ToolUtil.isArray(data.filedUrls)[index];
    return {
      url,
      mediaId: item,
    };
  }) : [];

  const drawings = data.drawing ? ToolUtil.isArray(data.drawing.split(',')).map((item, index) => {
    const url = ToolUtil.isArray(data.drawingUrls)[index];
    return {
      url,
      mediaId: item,
    };
  }) : [];

  const editAction = (newData = {}) => {
    edit({ data: { skuId, images: data.images, fileId: data.fileId, drawing: data.drawing, ...newData } });
  };

  return <div className={style.skuDetail}>
    <MyNavBar title='物料详情' />
    <MyCard title='基本信息'>
      <div className={style.item}>
        <Label className={style.label}>物料编码：</Label>
        {data.standard}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料分类：</Label>
        {data.spuResult && data.spuResult.spuClassificationResult && data.spuResult.spuClassificationResult.name}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料名称：</Label>
        {data.spuResult && data.spuResult.name}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料型号：</Label>
        {data.skuName}
      </div>
      <div className={style.item}>
        <Label className={style.label}>物料规格：</Label>
        {data.specifications}
      </div>
      <div className={style.item}>
        <Label
          className={style.label}>单位：</Label>
        {data.spuResult && data.spuResult.unitResult && data.spuResult.unitResult.unitName}
      </div>
      <div className={style.item}>
        <Label className={style.label}>品牌：</Label>
        {data.brandResults && data.brandResults.map((item) => item.brandName).join(',')}
      </div>
      <div className={style.item}>
        <Label className={style.label}>创建人：</Label>
        {ToolUtil.isObject(data.user).name}
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
          value={imgs}
          max={3}
          noFile
          icon={<CameraOutline />}
          onChange={(mediaIds) => {
            editAction({ images: mediaIds.toString() });
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
          value={files}
          noFile
          icon={<CameraOutline />}
          onChange={(mediaIds) => {
            editAction({ fileId: mediaIds.toString() });
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
          value={drawings}
          noFile
          icon={<CameraOutline />}
          onChange={(mediaIds) => {
            editAction({ drawing: mediaIds.toString() });
          }}
        />
      </div>
    </MyCard>

    {(editLoading || loading) && <MyLoading />}
  </div>;
};

export default SkuDetail;
