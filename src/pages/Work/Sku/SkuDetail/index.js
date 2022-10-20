import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { MyLoading } from '../../../components/MyLoading';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.less';
import { classNames, isArray, isObject, ToolUtil, viewWidth } from '../../../components/ToolUtil';
import { FloatingBubble, ImageViewer, Space, Swiper } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import { useModel } from 'umi';
import Expand from '../../../components/Expand';
import SearchInkind from '../../../components/InkindList/components/SearchInkind';
import ShowCode from '../../../components/ShowCode';
import Icon from '../../../components/Icon';
import MyAntPopup from '../../../components/MyAntPopup';
import Drawings from './components/Drawings';
import Files from './components/Files';
import Supply from './components/Supply';
import Doms from './components/Doms';
import { previewImage } from '../../../components/Upload/UploadFile';

export const spuClassificationDetail = {
  url: '/spuClassification/detail',
  method: 'POST',
};

const SkuDetail = ({ id }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { query } = useLocation();

  const history = useHistory();

  const skuId = id || query.skuId;

  const [detail, setDetail] = useState();

  const [stockInfo, setStockInfo] = useState();

  const [visible, setVisible] = useState('');

  const [expand, setExpand] = useState(false);

  const [typeSetting, setTypeSetting] = useState([]);

  const { loading: skuFormLoading, run: getSkuForm } = useRequest(spuClassificationDetail, {
    manual: true,
    onSuccess: (res) => {
      setTypeSetting(res && res.typeSetting && JSON.parse(res.typeSetting) || []);
    },
  });

  const { loading, run } = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      const spuClassificationId = res?.spuClass;
      if (spuClassificationId) {
        getSkuForm({ data: { spuClassificationId } });
      }
      const detail = res || {};
      const imgs = isArray(detail.imgResults).map((item) => {
        return {
          showUrl: item.url,
          url: item.thumbUrl,
          mediaId: item.mediaId,
        };
      });
      setDetail({ ...detail, imgs });
    },
  });

  useEffect(() => {
    if (skuId) {
      run({ data: { skuId } });
    }
  }, [skuId]);

  if (loading || skuFormLoading) {
    return <MyLoading skeleton />;
  }

  if (!detail) {
    return <MyEmpty />;
  }

  const imgs = isArray(detail.imgs).length > 0 ? detail.imgs : [{ showUrl: state.imgLogo }];
  const spuResult = detail.spuResult || {};
  const spuClassificationResult = spuResult.spuClassificationResult || {};
  const unitResult = spuResult.unitResult || {};
  const stockNumber = (detail.stockNumber || 0) - (detail.lockStockDetailNumber || 0);

  return <div className={styles.skuDetail} id='skuDetail'>
    <MyNavBar title='物料详情' />
    <Swiper
      indicator={(total, current) => (
        <>
          <div className={styles.edit}>
            <Icon type='icon-bianji1' onClick={() => {
              history.push({
                pathname: '/Work/Sku/Edit',
                query: { skuId: detail.skuId },
              });
            }} />
          </div>
          <div className={styles.customIndicator}>
            {`${current + 1} / ${total}`}
          </div>
        </>
      )}
    >
      {
        imgs.map((item, index) => (
          <Swiper.Item key={index}>
            <div className={styles.imgs} onClick={() => {
              const images = imgs.map(item => item.showUrl) || [];
              if (!ToolUtil.isQiyeWeixin()) {
                ImageViewer.Multi.show({
                  getContainer: () => document.getElementById('skuDetail'),
                  images,
                  defaultIndex: index,
                })
              }
              previewImage(item.showUrl || item.url, images);
            }}>
              <img src={item.showUrl} width={viewWidth()} height={viewWidth()} alt='' />
            </div>
          </Swiper.Item>
        ))
      }
    </Swiper>


    <div className={styles.header}>
      <div className={classNames(styles.flexCenter, styles.sku)}>
        <div className={styles.flexGrow}>
          <div className={styles.spuName}>
            {spuResult.name}
          </div>
          <div className={styles.skuName}>
            {SkuResultSkuJsons({ skuResult: detail, sku: true })}
          </div>
          <div className={styles.bindPosition}>
            铸件一区 / 南坡大库
          </div>
        </div>
        <div className={styles.otherData}>
          <ShowCode type='sku' size={20} source='sku' id={detail.skuId} />
          <div className={styles.number}>
            <span>×{stockNumber}</span>
            {unitResult.unitName}
          </div>
        </div>
      </div>
      <div className={classNames(styles.actions, styles.flexCenter)}>
        <div className={classNames(styles.action, styles.flexGrow)} onClick={() => {
          setStockInfo({
            skuId: detail.skuId,
          });
        }}>
          <Icon type='icon-kucunmingxi1' />库存明细
        </div>
        <div className={classNames(styles.action, styles.flexGrow)} onClick={() => {
          history.push({
            pathname: '/Work/ProcessTask',
            query: { taskSkuId: detail.skuId },
          });
        }}>
          <Icon type='icon-guanlianrenwu' />关联任务
        </div>
        <div className={classNames(styles.action, styles.flexGrow)} onClick={() => {
          setVisible('log');
        }}>
          <Icon type='icon-caozuojilu' />操作记录
        </div>
      </div>
    </div>

    <div className={styles.skuData}>
      <Space direction='vertical' style={{width:'100%'}}>
        {
          typeSetting
            .filter((item, index) => !['images', 'drawing', 'fileId'].includes(item.key) && item.show && (!expand ? index <= 3 : true))
            .map((item, index) => {
              let children;
              switch (item.key) {
                case 'spuClass':
                  children = spuClassificationResult.name;
                  break;
                case 'standard':
                  children = detail.standard;
                  break;
                case 'spu':
                  children = spuResult.name;
                  break;
                case 'batch':
                  children = detail.batch ? '一批一码' : '一物一码';
                  break;
                case 'unitId':
                  children = isObject(detail.unit).unitName || '-';
                  break;
                case 'weight':
                  children = `${detail[item.key] || 0} kg`;
                  break;
                case 'maintenancePeriod':
                  children = `${detail[item.key] || 0} 天`;
                  break;
                case 'sku':
                  children = SkuResultSkuJsons({
                    skuResult: detail,
                    describe: true,
                    emptyText: '无',
                  });
                  break;
                case 'materialId':
                  children = isArray(detail.materialResultList).map(item => item.name).join('、') || '-';
                  break;
                case 'brandIds':
                  children = isArray(detail.brandResults).map(item => item.brandName).join('、') || '-';
                  break;
                case 'skuSize':
                  children = detail.skuSize && detail.skuSize.split(',').join('×') || '-';
                  break;
                default:
                  children = detail[item.key] || '-';
              }
              return <div className={styles.flexCenter} key={index}>
                <Label className={styles.label}>
                  {item.filedName}
                </Label>
                <div className={styles.value}>
                  {children}
                </div>

              </div>;
            })
        }
      </Space>
      <Expand expand={expand} onExpand={setExpand} />
    </div>


    <Supply skuId={detail.skuId} />
    <Doms skuId={detail.skuId} />
    <Drawings skuId={detail.skuId} />
    <Files skuId={detail.skuId} />

    <SearchInkind
      noActions
      hiddenHeader
      skuInfo={stockInfo}
      onClose={() => setStockInfo(false)}
      visible={stockInfo}
    />

    <MyAntPopup
      visible={visible === 'log'}
      title='操作记录'
      onClose={() => setVisible('')}
    >
      <MyEmpty />
    </MyAntPopup>

  </div>;
};

export default SkuDetail;
