import React, { useEffect, useRef, useState } from 'react';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import LinkButton from '../../../../../../../../components/LinkButton';
import { ScanIcon } from '../../../../../../../../components/Icon';
import style from './index.less';
import MyCheck from '../../../../../../../../components/MyCheck';
import UploadFile from '../../../../../../../../components/Upload/UploadFile';
import { CameraOutline } from 'antd-mobile-icons';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../components/Message';
import { useRequest } from '../../../../../../../../../util/Request';
import InkindList from '../../../../../../../../components/InkindList';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyTextArea from '../../../../../../../../components/MyTextArea';
import Careful from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/InstockSkus/components/Careful';
import { ReceiptsEnums } from '../../../../../../../index';
import MyCard from '../../../../../../../../components/MyCard';

export const maintenanceLogAdd = { url: '/maintenanceLog/add', method: 'POST' };

const Maintenanceing = (
  {
    maintenanceId,
    skuItem = {},
    onSuccess = () => {
    },
  },
) => {

  const inkindRef = useRef();

  const [brands, setBrands] = useState([]);

  const completeBrands = brands.filter(item => item.checked && item.curingNumber > 0);

  const [complete, setComplete] = useState([]);

  const { loading: maintenanceLogLoading, run: maintenanceLogRun } = useRequest(maintenanceLogAdd,
    {
      manual: true,
      onSuccess: () => {
        Message.successToast('养护成功！', () => {
          inkindRef.current.close();
          onSuccess({
            positionId: skuItem.positionId,
            skuId: skuItem.skuId,
            brands: complete,
          });
        });
      },
      onError: () => Message.errorToast('养护失败！'),
    });

  const [params, setParams] = useState({});

  useEffect(() => {
    const brands = skuItem.brandResults || [];
    if (brands.length === 1) {
      const brand = brands[0] || {};
      setBrands([{ ...brand, curingNumber: brand.number, checked: true }]);
    } else {
      setBrands(brands.map(item => {
        return {
          ...item,
          curingNumber: 0,
        };
      }));
    }
  }, []);

  const brandsChange = (data, currentIndex) => {
    const newBrands = brands.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...data };
      } else {
        return item;
      }
    });
    setBrands(newBrands);
  };

  const submit = (maintenanceLogDetailParams) => {
    setComplete(maintenanceLogDetailParams.map(item => {
      return {
        brandId: item.brandId,
        number: item.number,
      };
    }));
    maintenanceLogRun({
      data: {
        maintenanceId,
        enclosure: params.files,
        maintenanceLogDetailParams,
      },
    });
  };

  return <div style={{ paddingBottom: 60, maxWidth: '80vh', overflow: 'hidden' }}>
    <div className={style.skuItem}>
      <div className={style.sku}>
        <SkuItem extraWidth='94px' skuResult={skuItem.skuResult} otherData={[skuItem.positionName]} />
      </div>
      <div className={style.actions}>
        <div hidden className={style.sop}>
          <LinkButton>养护指导</LinkButton>
        </div>
        <div>
          <ScanIcon style={{ fontSize: 24 }} onClick={() => {
            inkindRef.current.open({
              skuId: skuItem.skuId,
              positionId: skuItem.positionId,
              skuResult: skuItem.skuResult,
              maintenanceId,
            });
          }} />
        </div>
      </div>
    </div>

    <div className={style.brands}>
      {
        brands.map((item, index) => {
          const checked = item.checked;
          return <div key={index} className={style.brandItem}>
            <div className={style.brand} onClick={() => {
              brandsChange({ checked: !checked, curingNumber: checked ? 0 : item.number }, index);
            }}>
              <MyCheck fontSize={22} checked={checked} />
              <span>{item.brandName}</span>
              <span>({item.number})</span>
            </div>
            <div hidden={!checked}>
              <ShopNumber
                max={item.number}
                min={1}
                value={item.curingNumber}
                onChange={(curingNumber) => {
                  brandsChange({ curingNumber }, index);
                }}
              />
            </div>
          </div>;
        })
      }
    </div>

    <MyCard title='养护内容'>
      <Careful
        type={ReceiptsEnums.maintenance}
        value={params.noticeIds}
        onChange={(noticeIds) => {
          setParams({ ...params, noticeIds });
        }}
      />
    </MyCard>
    <MyCard title='添加备注'>
      <MyTextArea value={params.remake} onChange={(remake) => {
        setParams({ ...params, remake });
      }} />
    </MyCard>

    <MyCard title='上传附件'>
      <UploadFile
        imgSize={36}
        icon={<CameraOutline />}
        noFile
        onChange={(mediaIds) => {
          setParams({ ...params, files: mediaIds });
        }}
      />
    </MyCard>

    <InkindList
      ref={inkindRef}
      onSuccess={(inkinds = []) => {
        const newBrands = brands.map(item => {
          const brands = inkinds.filter(inkindItem => inkindItem.brandId === item.brandId);
          if (brands.length > 0) {
            let number = 0;
            brands.forEach(item => number += item.number);
            const curingNumber = item.curingNumber + number;
            return {
              ...item,
              checked: true,
              curingNumber: item.number >= curingNumber ? curingNumber : item.number,
            };
          }
          return item;
        });
        setBrands(newBrands);
      }}
    />

    <BottomButton disabled={completeBrands.length === 0} only onClick={() => {
      submit(completeBrands.map(item => {
        return {
          brandId: item.brandId,
          storehousePositionsId: skuItem.positionId,
          skuId: skuItem.skuId,
          number: item.curingNumber,
        };
      }));
    }} />

    {maintenanceLogLoading && <MyLoading />}
  </div>;
};

export default Maintenanceing;
