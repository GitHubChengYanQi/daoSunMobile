import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { MyLoading } from '../../../components/MyLoading';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './index.less';
import { classNames, isArray, viewWidth } from '../../../components/ToolUtil';
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

  const { loading, run } = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
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
  }, []);

  if (loading) {
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

  return <div className={styles.skuDetail}>
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
            <div className={styles.imgs} onClick={() => ImageViewer.Multi.show({
              images: imgs.map(item => item.showUrl),
              defaultIndex: index,
            })}>
              <img src={item.showUrl} width={viewWidth()} height={214} alt='' />
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
          <ShowCode type='sku' size={20} code={detail.skuId} id={detail.skuId} />
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
            query: { skuId: detail.skuId },
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
      <Space direction='vertical'>
        <div><Label className={styles.label}>物料编码</Label>{detail.standard}</div>
        <div><Label className={styles.label}>分类</Label>{spuClassificationResult.name}</div>
        {expand && <Space direction='vertical'>
          <div><Label className={styles.label}>材质</Label>{detail.none || '无'}</div>
          <div><Label className={styles.label}>重量</Label>{detail.none || '无'}</div>
          <div><Label
            className={styles.label}>养护周期</Label>{detail.maintenancePeriod ? detail.maintenancePeriod + '天' : '无'}
          </div>
          <div>
            <Label className={styles.label}>物料描述</Label>{SkuResultSkuJsons({
            skuResult: detail,
            describe: true,
            emptyText: '无',
          })}
          </div>
          <div><Label className={styles.label}>备注</Label>{detail.remarks || '无'}</div>
          <div><Label className={styles.label}>尺寸</Label>{detail.skuSize && detail.skuSize.split(',').join('×') || '无'}</div>
        </Space>}
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
