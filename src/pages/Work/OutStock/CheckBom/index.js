import React, { useEffect, useState } from 'react';
import style from '../BomAdd/index.less';
import SkuItem from '../../Sku/SkuItem';
import { useHistory, useLocation } from 'react-router-dom';
import MyCard from '../../../components/MyCard';
import { Picker, Space } from 'antd-mobile';
import MyRadio from '../../../components/MyRadio';
import ShopNumber from '../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyNavBar from '../../../components/MyNavBar';
import BottomButton from '../../../components/BottomButton';
import LinkButton from '../../../components/LinkButton';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import { shopCartAddList } from '../../Instock/Url';
import { ERPEnums } from '../../Stock/ERPEnums';
import { Message } from '../../../components/Message';

export const list = { url: '/erpPartsDetail/bomList', method: 'POST' };

const CheckBom = () => {

  const { query } = useLocation();

  const [type, setType] = useState('all');

  const [skuBrand, setSkuBrand] = useState({});

  const [number, setNumber] = useState(1);

  const [data, setData] = useState([]);

  const history = useHistory();

  const { loading: skuLoading, run: getSkuDetail, data: skuResult } = useRequest(skuDetail, { manual: true });
  const { loading, run } = useRequest(list, {
    manual: true,
    onSuccess: (res) => setData(res || []),
  });
  const { loading: addLoading, run: addShop } = useRequest(shopCartAddList, {
    manual: true,
    onSuccess: (res) => {
      Message.successToast('添加成功！', () => {
        history.go(-2);
      }, true);
    },
  });

  const skuId = query.skuId;
  const partsId = query.partsId;

  const submit = (data) => {
    run({ data });
  };

  useEffect(() => {
    if (skuId) {
      getSkuDetail({ data: { skuId } });
      submit({ skuId });
    }
  }, []);

  if (skuLoading || loading) {
    return <MyLoading skeleton />;
  }
  return <>
    <MyNavBar title='选择BOM' />
    <div className={style.bom}>
      <SkuItem skuResult={skuResult} className={style.sku} extraWidth='80px' />
      <ShopNumber value={number} onChange={setNumber} />
    </div>

    <MyCard title='配套物料' extra={
      <Space>
        <MyRadio onChange={() => {
          setType('all');
          submit({ skuId });
        }} checked={type === 'all'}>基础物料</MyRadio>
        <MyRadio onChange={() => {
          setType('next');
          submit({ partsId });
        }} checked={type === 'next'}>子级物料</MyRadio>
      </Space>
    }>
      <div className={style.skuList}>
        {
          data.map((item, index) => {
            const skuResult = item.skuResult || {};
            const spuResult = skuResult.spuResult || {};
            const unitResult = spuResult.unitResult || {};
            const brandResults = skuResult.brandResults || [];
            const brand = item.brand || {};
            return <div key={index} className={style.bomItem} style={{
              padding: '8px 0px',
              borderBottom: '1px solid #f5f5f5',
            }}>
              <SkuItem
                extraWidth='90px'
                className={style.sku}
                skuResult={skuResult}
                otherData={[brandResults.length > 0 ? <LinkButton onClick={() => {
                  setSkuBrand({
                    skuId: item.skuId,
                    brandResults,
                    brand,
                  });
                }}>{brand.brandName || '任意品牌'}</LinkButton> : '任意品牌']}
              />
              <div>
                {item.number}{unitResult.unitName} / 每套
              </div>
            </div>;
          })
        }
        <div style={{ height: 60 }} />
      </div>
    </MyCard>

    <BottomButton only onClick={() => {
      const shopCartParams = data.map(item => {
        const brand = item.brand || {};
        return {
          skuId: item.skuId,
          brandId: brand.brandId,
          number: number * item.number,
          type: ERPEnums.outStock,
        };
      });
      addShop({ data: { shopCartParams } });
    }} />

    <Picker
      destroyOnClose
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[[{ label: '任意品牌', value: 0 }, ...ToolUtil.isArray(skuBrand.brandResults).map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      })]]}
      visible={skuBrand.skuId || false}
      onClose={() => setSkuBrand({})}
      value={[ToolUtil.isObject(skuBrand.brand).brandId]}
      onConfirm={(value, options) => {
        const brand = options.items[0] || {};
        const newData = data.map(item => {
          if (item.skuId === skuBrand.skuId) {
            return { ...item, brand: { brandId: brand.value, brandName: brand.label } };
          }
          return item;
        });
        setData(newData);
      }}
    />

    {addLoading && <MyLoading />}
  </>;
};

export default CheckBom;
