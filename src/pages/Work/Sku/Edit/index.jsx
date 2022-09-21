import React, { useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail, skuEdit } from '../../../Scan/Url';
import { isArray, isObject } from '../../../components/ToolUtil';
import { useHistory, useLocation } from 'react-router-dom';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import LinkButton from '../../../components/LinkButton';
import MyPicker from '../../../components/MyPicker';
import { RightOutline } from 'antd-mobile-icons';
import { Input, Space, TextArea } from 'antd-mobile';
import MyKeybord from '../../../components/MyKeybord';
import styles from './index.less';
import UploadFile from '../../../components/Upload/UploadFile';
import { PaperClipOutlined } from '@ant-design/icons';
import BottomButton from '../../../components/BottomButton';
import { Message } from '../../../components/Message';

const Edit = () => {

  const { query } = useLocation();

  const [detail, setDetail] = useState({});

  const [visible, setVisible] = useState('');

  const history = useHistory();

  const skuFiles = useRef();
  const skuDrawings = useRef();

  const { loading: editLoading, run: edit } = useRequest(skuEdit,
    {
      manual: true,
      onSuccess: () => {
        Message.successDialog({
          content: '修改成功！',
          confirmText: '返回详情',
          cancelText: '继续修改',
          onConfirm: () => history.goBack(),
        });
      },
      onError: () => Message.toast('修改失败！'),
    },
  );

  const { loading } = useRequest(
    { ...skuDetail, data: { skuId: query.skuId } },
    {
      manual: !query.skuId,
      onSuccess: (res) => {
        const detail = res || {};
        const sku = isArray(detail.skuJsons).length > 0 ? detail.skuJsons.map((items) => {
          return {
            label: isObject(items.attribute).attribute,
            value: isObject(items.values).attributeValues,
            disabled: true,
          };
        }) : [];
        const spuResult = detail.spuResult || {};
        setDetail({ ...detail, spu: spuResult, sku, unitId: spuResult.unitId });
      },
    });

  if (loading) {
    return <MyLoading />;
  }

  const spuResult = detail.spuResult || {};
  const spuClassificationResult = spuResult.spuClassificationResult || {};
  const unitResult = spuResult.unitResult || {};

  const detailChange = (newDetail = {}) => {
    setDetail({ ...detail, ...newDetail });
  };

  const getNumber = (type) => {
    switch (type) {
      case 'maintenancePeriod':
        return detail.maintenancePeriod;
      case 'weight':
        return detail.weight;
      case 'length':
        return detail.length;
      case 'width':
        return detail.width;
      case 'height':
        return detail.height;
      default:
        break;
    }
  };

  return <div style={{ paddingBottom: 60 }}>
    <MyNavBar title='编辑物料' />
    <MyCard title='物料编码' extra={<span className={styles.disabled}>{detail.standard}</span>} />
    <MyCard title='型号' extra={<span className={styles.disabled}>{spuResult.name}</span>} />
    <MyCard title='名称' extra={<span className={styles.disabled}>{detail.skuName}</span>} />
    <MyCard title='规格' extra={<span className={styles.disabled}>{detail.specifications}</span>} />
    <MyCard title='分类' extra={<span className={styles.disabled}>{spuClassificationResult.name}</span>} />
    <MyCard title='单位' extra={<span className={styles.disabled}>{unitResult.unitName}</span>} />
    <MyCard title='实物码' extra={<span onClick={() => {
      setVisible('batch');
    }}>{detail.batch === 0 ? '一件一码' : '一批一码'} <RightOutline /></span>} />
    <MyCard title='材质' extra={<span>钢铁铜铝</span>} />
    <MyCard title='养护周期' extra={<span onClick={() => {
      setVisible('maintenancePeriod');
    }}>{detail.maintenancePeriod}&nbsp;&nbsp;天</span>} />
    <MyCard title='重量' extra={<span onClick={() => {
      setVisible('weight');
    }}>{detail.weight || 0}&nbsp;&nbsp;kg</span>} />
    <MyCard title='尺寸' extra={<Space align='center'>
      <div onClick={() => {
        setVisible('length');
      }}>
        长<span style={{ padding: '0 2px' }}>{detail.length || 0}</span>cm
      </div>
      ×
      <div onClick={() => {
        setVisible('width');
      }}>
        宽<span style={{ padding: '0 2px' }}>{detail.width || 0}</span>cm
      </div>
      ×
      <div onClick={() => {
        setVisible('height');
      }}>
        高<span style={{ padding: '0 2px' }}>{detail.height || 0}</span>cm
      </div>
    </Space>} />
    <MyCard title='备注'>
      <TextArea
        style={{ '--font-size': '14px' }}
        placeholder='请输入备注'
        value={detail.remarks}
        onChange={(remarks) => detailChange({ remarks })}
      />
    </MyCard>
    <MyCard title='照片'>
      <UploadFile
        max={5}
        noFile
        uploadId='skuImgs'
        files={isArray(detail.imgResults).map(item => ({
          ...item,
          showUrl: item.url,
          url: item.thumbUrl || item.url,
        }))}
        onChange={(medias) => {
          detailChange({ imgResults: medias, images: medias.map(item => item.mediaId).toString() });
        }} />
    </MyCard>
    <MyCard title='图纸' extra={isArray(detail.drawingResults).length < 5 && <LinkButton onClick={() => {
      skuDrawings.current.addFile();
    }}>
      <PaperClipOutlined />
    </LinkButton>}>
      <UploadFile
        file
        uploadId='skuDrawings'
        ref={skuDrawings}
        files={isArray(detail.drawingResults)}
        onChange={(medias) => {
          detailChange({ drawingResults: medias, drawing: medias.map(item => item.mediaId).toString() });
        }} />
    </MyCard>
    <MyCard title='附件' extra={isArray(detail.filedResults).length < 5 && <LinkButton onClick={() => {
      skuFiles.current.addFile();
    }}>
      <PaperClipOutlined />
    </LinkButton>}>
      <UploadFile
        file
        uploadId='skuFiles'
        ref={skuFiles}
        files={isArray(detail.filedResults)}
        onChange={(medias) => {
          detailChange({ filedResults: medias, fileId: medias.map(item => item.mediaId).toString() });
        }} />
    </MyCard>

    <MyPicker
      visible={visible === 'batch'}
      options={[{ label: '一批一码', value: 1 }, { label: '一件一码', value: 0 }]}
      value={detail.batch}
      onClose={() => setVisible('')}
      onChange={(option) => {
        detailChange({ batch: option.value });
        setVisible('');
      }}
    />

    <MyKeybord
      decimal={visible !== 'maintenancePeriod' && 2}
      visible={['maintenancePeriod', 'weight', 'length', 'width', 'height'].includes(visible)}
      setVisible={() => setVisible('')}
      value={getNumber(visible)}
      min={0}
      onChange={(number) => {
        switch (visible) {
          case 'maintenancePeriod':
            detailChange({ maintenancePeriod: number });
            break;
          case 'weight':
            detailChange({ weight: number });
            break;
          case 'length':
            detailChange({ length: number });
            break;
          case 'width':
            detailChange({ width: number });
            break;
          case 'height':
            detailChange({ height: number });
            break;
          default:
            break;
        }
        setVisible('');
      }}
    />

    <BottomButton
      onClick={() => {
        edit({
          data: detail,
        });
      }}
      only
      text='保存'
    />

    {editLoading && <MyLoading />}
  </div>;
};

export default Edit;
