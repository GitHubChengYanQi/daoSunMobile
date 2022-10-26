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
import { spuClassificationDetail } from '../SkuDetail';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { materialListSelect } from '../../ProcessTask/Create/components/Inventory/compoennts/AllCondition';

export const editEnclosure = { url: '/sku/editEnclosure', method: 'POST' };
export const materialListSelect = {
  url: '/material/listSelect',
  method: 'POST',
};

const Edit = () => {

  const { query } = useLocation();

  const [detail, setDetail] = useState({});

  const [visible, setVisible] = useState('');

  const [typeSetting, setTypeSetting] = useState([]);

  const history = useHistory();

  const skuFiles = useRef();
  const skuDrawings = useRef();

  const { loading: skuFormLoading, run: getSkuForm } = useRequest(spuClassificationDetail, {
    manual: true,
    onSuccess: (res) => {
      setTypeSetting(res && res.typeSetting && JSON.parse(res.typeSetting) || []);
    },
  });

  const { loading: meterialLoading, data: materialList } = useRequest(materialListSelect);

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

  const { loading, refresh } = useRequest(
    { ...skuDetail, data: { skuId: query.skuId } },
    {
      manual: !query.skuId,
      onSuccess: (res) => {
        const spuClassificationId = res?.spuClass;
        if (spuClassificationId) {
          getSkuForm({ data: { spuClassificationId } });
        }
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

  const { loading: editEnclosureLoading, run: editEnclosureRun } = useRequest(editEnclosure, {
    manual: true,
    onError: () => {
      Message.errorToast('修改失败!');
    },
  });

  if ((loading || skuFormLoading) && !detail.skuId) {
    return <MyLoading />;
  }

  const spuResult = detail.spuResult || {};
  const spuClassificationResult = spuResult.spuClassificationResult || {};
  const unitResult = spuResult.unitResult || {};

  const detailChange = (newDetail = {}) => {
    setDetail({ ...detail, ...newDetail });
  };

  const skuSize = detail.skuSize && detail.skuSize.split(',') || [];

  const getNumber = (type) => {
    switch (type) {
      case 'maintenancePeriod':
        return detail.maintenancePeriod;
      case 'weight':
        return detail.weight;
      case 'length':
        return skuSize[0];
      case 'width':
        return skuSize[1];
      case 'height':
        return skuSize[2];
      default:
        break;
    }
  };


  const editAction = async (newData = {}) => {
    return await editEnclosureRun({
      data: {
        skuId: detail.skuId,
        images: detail.images,
        fileId: detail.fileId,
        drawing: detail.drawing, ...newData,
      },
    });
  };

  return <div style={{ paddingBottom: 60 }}>
    <MyNavBar title='编辑物料' />
    {
      typeSetting
        .filter((item) => item.show)
        .map((item, index) => {
          let extra;
          let content;
          switch (item.key) {
            case 'spuClass':
              extra = <span className={styles.disabled}>{spuClassificationResult.name}</span>;
              break;
            case 'unitId':
              extra = <span className={styles.disabled}>{unitResult.unitName}</span>;
              break;
            case 'standard':
              extra = <span className={styles.disabled}>{detail.standard}</span>;
              break;
            case 'spu':
              extra = <span className={styles.disabled}>{spuResult.name}</span>;
              break;
            case 'spuCoding':
              extra = <span className={styles.disabled}>{spuResult.coding}</span>;
              break;
            case 'batch':
              extra = <span onClick={() => {
                setVisible('batch');
              }}>{detail.batch === 0 ? '一件一码' : '一批一码'} <RightOutline /></span>;
              break;
            case 'maintenancePeriod':
              extra = <span onClick={() => {
                setVisible('maintenancePeriod');
              }}>{detail.maintenancePeriod}&nbsp;&nbsp;天</span>;
              break;
            case 'weight':
              extra = <span onClick={() => {
                setVisible('weight');
              }}>{parseInt(detail.weight) || <span style={{ color: '#ccc' }}>请输入</span>}&nbsp;&nbsp;kg</span>;
              break;
            case 'sku':
              extra = <span className={styles.disabled}>
                {SkuResultSkuJsons({
                  skuResult: detail,
                  describe: true,
                  emptyText: '无',
                })}
              </span>;
              break;
            case 'brandIds':
              extra = <span className={styles.disabled}>
                {isArray(detail.brandResults).map(item => item.brandName).join('、') || '-'}
              </span>;
              break;
            case 'materialId':
              extra = <span onClick={() => {
                setVisible('materialId');
              }}>{isArray(detail.materialResultList).map(item => item.name).join('、') || '请选择'} <RightOutline /></span>;
              break;
            case 'remarks':
              content = <TextArea
                style={{ '--font-size': '14px' }}
                placeholder={`请输入${item.filedName}`}
                value={detail.remarks}
                onChange={(remarks) => detailChange({ remarks })}
              />;
              break;
            case 'skuSize':
              return <div key={index}>
                <MyCard extraClassName={styles.extra} title='长' extra={<div onClick={() => {
                  setVisible('length');
                }}>
                  {parseInt(skuSize[0]) || <span style={{ color: '#ccc' }}>请输入</span>}&nbsp;&nbsp;cm
                </div>} />
                <MyCard extraClassName={styles.extra} title='宽' extra={<div onClick={() => {
                  setVisible('width');
                }}>
                  {parseInt(skuSize[1]) || <span style={{ color: '#ccc' }}>请输入</span>}&nbsp;&nbsp;cm
                </div>} />
                <MyCard extraClassName={styles.extra} title='高' extra={<div onClick={() => {
                  setVisible('height');
                }}>
                  {parseInt(skuSize[2]) || <span style={{ color: '#ccc' }}>请输入</span>}&nbsp;&nbsp;cm
                </div>} />
              </div>;
            case 'fileId':
              extra = isArray(detail.filedResults).length < 5 && <LinkButton onClick={() => {
                skuFiles.current.addFile();
              }}>
                <PaperClipOutlined />
              </LinkButton>;
              content = <UploadFile
                file
                uploadId='skuFiles'
                ref={skuFiles}
                files={isArray(detail.filedResults)}
                onChange={async (medias) => {
                  editAction({ fileId: medias.map(item => item.mediaId).toString() }).then(() => {
                    setDetail({ ...detail, filedResults: medias, fileId: medias.map(item => item.mediaId).toString() });
                  });
                }} />;
              break;
            case 'images':
              content = <UploadFile
                max={5}
                noFile
                uploadId='skuImgs'
                files={isArray(detail.imgResults).map(item => ({
                  ...item,
                  showUrl: item.url,
                  url: item.thumbUrl || item.url,
                }))}
                onChange={(medias) => {
                  editAction({ images: medias.map(item => item.mediaId).toString() }).then(() => {
                    setDetail({ ...detail, imgResults: medias, images: medias.map(item => item.mediaId).toString() });
                  });
                }} />;
              break;
            case 'drawing':
              extra = isArray(detail.drawingResults).length < 5 && <LinkButton onClick={() => {
                skuDrawings.current.addFile();
              }}>
                <PaperClipOutlined />
              </LinkButton>;
              content = <UploadFile
                file
                uploadId='skuDrawings'
                ref={skuDrawings}
                files={isArray(detail.drawingResults)}
                onChange={(medias) => {
                  editAction({ drawing: medias.map(item => item.mediaId).toString() }).then(() => {
                    setDetail({
                      ...detail,
                      drawingResults: medias,
                      drawing: medias.map(item => item.mediaId).toString(),
                    });
                  });
                }} />;
              break;
            default:
              extra = <Input
                value={detail[item.key]}
                placeholder={`请输入${item.filedName}`}
                onChange={(value) => {
                  detail[item.key] = value;
                  detailChange(detail);
                }}
              />;
              break;
          }
          return <MyCard
            className={styles.card}
            key={index}
            title={item.filedName}
            extra={extra}
            extraClassName={styles.extra}
          >
            {content}
          </MyCard>;
        })
    }


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

    <MyPicker
      visible={visible === 'materialId'}
      options={materialList || []}
      value={JSON.parse(detail.materialId || '[]')[0]}
      onClose={() => setVisible('')}
      onChange={(option) => {
        detailChange({ materialId: [option.value], materialResultList: [{ name: option.label }] });
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
            detailChange({ skuSize: `${number || 0},${skuSize[1] || 0},${skuSize[2] || 0}` });
            break;
          case 'width':
            detailChange({ skuSize: `${skuSize[0] || 0},${number || 0},${skuSize[2] || 0}` });
            break;
          case 'height':
            detailChange({ skuSize: `${skuSize[0] || 0},${skuSize[1] || 0},${number || 0}` });
            break;
          default:
            break;
        }
        setVisible('');
      }}
    />

    <BottomButton
      onClick={() => {
        edit({ data: detail });
      }}
      only
      text='保存'
    />

    {(loading || editLoading || editEnclosureLoading || skuFormLoading) && <MyLoading />}
  </div>;
};

export default Edit;
